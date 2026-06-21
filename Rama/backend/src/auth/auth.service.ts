import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './Dto/register.dto';
import { LoginDto } from './Dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const {
      nombres,
      apellidos,
      email,
      password,
      telefono,
      dpi,
      foto_url,
      fecha_nacimiento,
    } = registerDto;

    const usuarioExistente = await this.db.query(
      `
      SELECT usuario_id
      FROM usuarios
      WHERE email = $1
      `,
      [email],
    );

    if (usuarioExistente.rows.length > 0) {
      throw new BadRequestException(
        'El correo ya existe',
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const nuevoUsuario = await this.db.query(
      `
      INSERT INTO usuarios (
        nombres,
        apellidos,
        email,
        password_hash,
        telefono,
        dpi,
        foto_url,
        fecha_nacimiento
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8
      )
      RETURNING usuario_id
      `,
      [
        nombres,
        apellidos,
        email,
        passwordHash,
        telefono,
        dpi ?? null,
        foto_url ?? null,
        fecha_nacimiento ?? null,
      ],
    );

    const usuarioId =
      nuevoUsuario.rows[0].usuario_id;

    const rolCliente = await this.db.query(
      `
      SELECT rol_id
      FROM roles
      WHERE nombre_rol = 'Cliente'
      `,
    );

    await this.db.query(
      `
      INSERT INTO usuario_roles (
        usuario_id,
        rol_id
      )
      VALUES ($1,$2)
      `,
      [
        usuarioId,
        rolCliente.rows[0].rol_id,
      ],
    );

    return {
      message: 'Usuario registrado correctamente',
      usuario_id: usuarioId,
    };
  }

  // Login Acceso
  async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  const usuario = await this.db.query(
    `
    SELECT
      usuario_id,
      nombres,
      apellidos,
      email,
      password_hash,
      activo
    FROM usuarios
    WHERE email = $1
    `,
    [email],
  );

  if (usuario.rows.length === 0) {
    throw new UnauthorizedException(
      'Credenciales inválidas',
    );
  }

  const user = usuario.rows[0];

  if (!user.activo) {
    throw new UnauthorizedException(
      'Usuario inactivo',
    );
  }

  const passwordValida = await bcrypt.compare(
    password,
    user.password_hash,
  );

  if (!passwordValida) {
    throw new UnauthorizedException(
      'Credenciales inválidas',
    );
  }

  const roles = await this.db.query(
    `
    SELECT r.nombre_rol
    FROM usuario_roles ur
    INNER JOIN roles r
      ON ur.rol_id = r.rol_id
    WHERE ur.usuario_id = $1
    `,
    [user.usuario_id],
  );

  const payload = {
    sub: user.usuario_id,
    email: user.email,
    nombres: user.nombres,
    rol: roles.rows[0]?.nombre_rol,
  };

  const token = this.jwtService.sign(payload);

  return {
    access_token: token,
    usuario: {
      id: user.usuario_id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      rol: roles.rows[0]?.nombre_rol,
    },
  };
}
}