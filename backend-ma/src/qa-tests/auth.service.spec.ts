import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service'
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import {
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock de bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;

    // Mock de DatabaseService
    const mockDb = {
        query: jest.fn(),
    };

    // Mock de JwtService
    const mockJwt = {
        sign: jest.fn().mockReturnValue('token_falso_123'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: DatabaseService, useValue: mockDb },
                { provide: JwtService, useValue: mockJwt },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);

        // Limpia los mocks entre cada test
        jest.clearAllMocks();
    });

    // ─────────────────────────────────────────────
    // REGISTER
    // ─────────────────────────────────────────────
    describe('register', () => {
        const registerDto = {
            nombres: 'Pablo',
            apellidos: 'García',
            email: 'pablo@test.com',
            password: 'Pass1234',
            telefono: '55551234',
            dpi: undefined,
            foto_url: undefined,
            fecha_nacimiento: undefined,
        };

        it('debe registrar un usuario nuevo correctamente', async () => {
            // Email no existe
            mockDb.query
                .mockResolvedValueOnce({ rows: [] })
                // INSERT usuario retorna ID
                .mockResolvedValueOnce({ rows: [{ usuario_id: 1 }] })
                // SELECT rol Cliente
                .mockResolvedValueOnce({ rows: [{ rol_id: 2 }] })
                // INSERT usuario_roles
                .mockResolvedValueOnce({ rows: [] });

            (bcrypt.hash as jest.Mock).mockResolvedValue('hash_seguro');

            const resultado = await service.register(registerDto);

            expect(resultado).toEqual({
                message: 'Usuario registrado correctamente',
                usuario_id: 1,
            });
        });

        it('debe lanzar BadRequestException si el email ya existe', async () => {
            // Email ya existe
            mockDb.query.mockResolvedValueOnce({ rows: [{ usuario_id: 99 }] });

            await expect(service.register(registerDto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    // ─────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────
    describe('login', () => {
        const loginDto = {
            email: 'pablo@test.com',
            password: 'Pass1234',
        };

        const usuarioMock = {
            usuario_id: 1,
            nombres: 'Pablo',
            apellidos: 'García',
            email: 'pablo@test.com',
            password_hash: 'hash_seguro',
            activo: true,
        };

        it('debe retornar token y datos del usuario al hacer login correcto', async () => {
            mockDb.query
                // SELECT usuario
                .mockResolvedValueOnce({ rows: [usuarioMock] })
                // SELECT roles
                .mockResolvedValueOnce({ rows: [{ nombre_rol: 'Cliente' }] });

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const resultado = await service.login(loginDto);

            expect(resultado).toHaveProperty('access_token', 'token_falso_123');
            expect(resultado.usuario.email).toBe('pablo@test.com');
            expect(resultado.usuario.rol).toBe('Cliente');
        });

        it('debe lanzar UnauthorizedException si el email no existe', async () => {
            mockDb.query.mockResolvedValueOnce({ rows: [] });

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
            mockDb.query.mockResolvedValueOnce({ rows: [usuarioMock] });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('debe lanzar ForbiddenException si el usuario está desactivado', async () => {
            mockDb.query.mockResolvedValueOnce({
                rows: [{ ...usuarioMock, activo: false }],
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
        });
    });

    // ─────────────────────────────────────────────
    // FORGOT PASSWORD
    // ─────────────────────────────────────────────
    describe('forgotPassword', () => {
        it('debe generar un token si el email existe', async () => {
            mockDb.query
                // SELECT usuario
                .mockResolvedValueOnce({ rows: [{ usuario_id: 1 }] })
                // INSERT token
                .mockResolvedValueOnce({ rows: [] });

            const resultado = await service.forgotPassword('pablo@test.com');

            expect(resultado).toHaveProperty('token');
            expect(resultado.expira_en).toBe('30 minutos');
        });

        it('debe lanzar BadRequestException si el email no existe', async () => {
            mockDb.query.mockResolvedValueOnce({ rows: [] });

            await expect(
                service.forgotPassword('noexiste@test.com'),
            ).rejects.toThrow(BadRequestException);
        });
    });

    // ─────────────────────────────────────────────
    // RESET PASSWORD
    // ─────────────────────────────────────────────
    describe('resetPassword', () => {
        const tokenValido = {
            usuario_id: 1,
            fecha_expiracion: new Date(Date.now() + 1000 * 60 * 10), // expira en 10 min
            usado: false,
        };

        it('debe restablecer la contraseña correctamente', async () => {
            mockDb.query
                // SELECT token
                .mockResolvedValueOnce({ rows: [tokenValido] })
                // UPDATE password
                .mockResolvedValueOnce({ rows: [] })
                // UPDATE token usado
                .mockResolvedValueOnce({ rows: [] });

            (bcrypt.hash as jest.Mock).mockResolvedValue('nuevo_hash');

            const resultado = await service.resetPassword('token_abc', 'NuevoPass1');

            expect(resultado.mensaje).toContain('restablecida');
        });

        it('debe lanzar BadRequestException si el token no existe', async () => {
            mockDb.query.mockResolvedValueOnce({ rows: [] });

            await expect(
                service.resetPassword('token_invalido', 'NuevoPass1'),
            ).rejects.toThrow(BadRequestException);
        });

        it('debe lanzar BadRequestException si el token ya fue usado', async () => {
            mockDb.query.mockResolvedValueOnce({
                rows: [{ ...tokenValido, usado: true }],
            });

            await expect(
                service.resetPassword('token_usado', 'NuevoPass1'),
            ).rejects.toThrow(BadRequestException);
        });

        it('debe lanzar BadRequestException si el token está expirado', async () => {
            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        ...tokenValido,
                        fecha_expiracion: new Date(Date.now() - 1000 * 60 * 60), // expiró hace 1 hora
                    },
                ],
            });

            await expect(
                service.resetPassword('token_expirado', 'NuevoPass1'),
            ).rejects.toThrow(BadRequestException);
        });
    });
});