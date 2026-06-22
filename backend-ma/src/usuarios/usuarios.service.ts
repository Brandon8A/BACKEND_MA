import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './Dto/update-profile.dto';
import { CreateUserDto } from './Dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CambiarPasswordDto } from './Dto/cambiar-password.dto';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly db: DatabaseService,
  ) {}

  //Listar Usuarios
  async listarUsuarios() {
    const result = await this.db.query(
    `
      SELECT
        u.usuario_id,
        u.nombres,
        u.apellidos,
        u.email,
        u.telefono,
        u.activo,
        r.nombre_rol AS rol
      FROM usuarios u
      INNER JOIN usuario_roles ur
        ON u.usuario_id = ur.usuario_id
      INNER JOIN roles r
        ON ur.rol_id = r.rol_id
      ORDER BY u.usuario_id DESC
      `,
    );

    return result.rows;
  }

  // Obtener Usuario por Id 
  async obtenerUsuarioPorId(
    usuarioId: number,
  ) {
    const result = await this.db.query(
      `
      SELECT
        u.usuario_id,
        u.nombres,
        u.apellidos,
        u.email,
        u.telefono,
        u.dpi,
        u.foto_url,
        u.fecha_nacimiento,
        u.activo,
        r.nombre_rol AS rol
      FROM usuarios u
      INNER JOIN usuario_roles ur
        ON u.usuario_id = ur.usuario_id
      INNER JOIN roles r
        ON ur.rol_id = r.rol_id
      WHERE u.usuario_id = $1
      `,
      [usuarioId],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException(
        'Usuario no encontrado',
      );
    }

    return result.rows[0];
  }

  // Crear Usuarios con Rol(Repartidor)
  async crearUsuarioConRol(
    createUserDto: CreateUserDto,
    nombreRol: string,
  ) {

    const client = await this.db.getClient();

    try {

      await client.query('BEGIN');

      const existe = await client.query(
        `
        SELECT usuario_id
        FROM usuarios
        WHERE email = $1
        `,
        [createUserDto.email],
      );

      if (existe.rows.length > 0) {
        throw new BadRequestException(
          'El correo ya está registrado',
        );
      }

      if (createUserDto.dpi) {

        const dpiExistente =
          await client.query(
            `
            SELECT usuario_id
            FROM usuarios
            WHERE dpi = $1
            `,
            [createUserDto.dpi],
          );

        if (dpiExistente.rows.length > 0) {
          throw new BadRequestException(
            'El DPI ya está registrado',
          );
        }
      }

      const passwordHash =
        await bcrypt.hash(
          createUserDto.password,
          10,
        );

      const usuario = await client.query(
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
          createUserDto.nombres,
          createUserDto.apellidos,
          createUserDto.email,
          passwordHash,
          createUserDto.telefono,
          createUserDto.dpi,
          createUserDto.foto_url,
          createUserDto.fecha_nacimiento,
        ],
      );

      const usuarioId =
        usuario.rows[0].usuario_id;

      const rol = await client.query(
        `
        SELECT rol_id
        FROM roles
        WHERE nombre_rol = $1
        `,
        [nombreRol],
      );

      if (rol.rows.length === 0) {
        throw new BadRequestException(
          'El rol indicado no existe',
        );
      }

      await client.query(
        `
        INSERT INTO usuario_roles (
          usuario_id,
          rol_id
        )
        VALUES ($1,$2)
        `,
        [
          usuarioId,
          rol.rows[0].rol_id,
        ],
      );

      await client.query('COMMIT');

      return {
        mensaje:
          `${nombreRol} creado correctamente`,
        usuario_id: usuarioId,
      };

    } catch (error) {

      await client.query('ROLLBACK');

      throw error;

    } finally {

      client.release();

    }
  }

  // Crear Usuario Repartidor
  async crearRepartidor(
    createUserDto: CreateUserDto,
  ) {
    return this.crearUsuarioConRol(
      createUserDto,
      'Repartidor',
    );
  }

  //Obtener el perfil del Usuario 
  async obtenerPerfil(usuarioId: number) {
    const result = await this.db.query(
      `
      SELECT
        u.usuario_id,
        u.nombres,
        u.apellidos,
        u.email,
        u.telefono,
        u.dpi,
        u.foto_url,
        u.fecha_nacimiento,
        u.activo,
        r.nombre_rol AS rol
      FROM usuarios u
      INNER JOIN usuario_roles ur
        ON u.usuario_id = ur.usuario_id
      INNER JOIN roles r
        ON ur.rol_id = r.rol_id
      WHERE u.usuario_id = $1
      `,
      [usuarioId],
    );


    if (result.rows.length === 0) {
    throw new BadRequestException(
        'Usuario no encontrado',
      );
    }

    return result.rows[0];
  }

  // Actualizar Perfil 
  async actualizarPerfil(
  usuarioId: number,
  updateProfileDto: UpdateProfileDto,
  ) {

  const {
    nombres,
    apellidos,
    telefono,
    dpi,
    foto_url,
    fecha_nacimiento,
  } = updateProfileDto;

  if (dpi) {
    const dpiExistente = await this.db.query(
      `
      SELECT usuario_id
      FROM usuarios
      WHERE dpi = $1
        AND usuario_id <> $2
      `,
      [dpi, usuarioId],
    );

    if (dpiExistente.rows.length > 0) {
      throw new BadRequestException(
        'El DPI ya está registrado',
      );
    }
  }

  const result = await this.db.query(
    `
    UPDATE usuarios
    SET
      nombres = COALESCE($1, nombres),
      apellidos = COALESCE($2, apellidos),
      telefono = COALESCE($3, telefono),
      dpi = COALESCE($4, dpi),
      foto_url = COALESCE($5, foto_url),
      fecha_nacimiento = COALESCE($6, fecha_nacimiento),
      fecha_actualizacion = NOW()
    WHERE usuario_id = $7
    RETURNING
      usuario_id,
      nombres,
      apellidos,
      email,
      telefono,
      dpi,
      foto_url,
      fecha_nacimiento,
      activo
    `,
    [
      nombres,
      apellidos,
      telefono,
      dpi,
      foto_url,
      fecha_nacimiento,
      usuarioId,
    ],
  );


  if (result.rows.length === 0) {
    throw new BadRequestException(
      'Usuario no encontrado',
    );
  }

    return result.rows[0];
  }

  // Activar usuario (solo admin)
  async activarUsuario(usuarioId: number) {
    const result = await this.db.query(
      `
      UPDATE usuarios
      SET activo = true,
          fecha_actualizacion = NOW()
      WHERE usuario_id = $1
      RETURNING usuario_id, activo
      `,
      [usuarioId],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return {
      mensaje: 'Usuario activado correctamente',
      usuario: result.rows[0],
    };
  }

  // Desactivar usuario (solo admin)
  async desactivarUsuario(usuarioId: number) {
    const result = await this.db.query(
      `
      UPDATE usuarios
      SET activo = false,
          fecha_actualizacion = NOW()
      WHERE usuario_id = $1
      RETURNING usuario_id, activo
      `,
      [usuarioId],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return {
      mensaje: 'Usuario desactivado correctamente',
      usuario: result.rows[0],
    };
  }

  //Cambiar Contrasenia
  async cambiarPassword(
    usuarioId: number,
    dto: CambiarPasswordDto,
  ) {

    const usuario = await this.db.query(
      `
      SELECT password_hash
      FROM usuarios
      WHERE usuario_id = $1
      `,
      [usuarioId],
    );

    if (usuario.rows.length === 0) {
      throw new BadRequestException(
        'Usuario no encontrado',
      );
    }

    const passwordCorrecta =
      await bcrypt.compare(
        dto.passwordActual,
        usuario.rows[0].password_hash,
      );

    if (!passwordCorrecta) {
      throw new BadRequestException(
        'La contraseña actual es incorrecta',
      );
    }

    if (dto.passwordActual === dto.passwordNueva) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    const nuevoHash =
      await bcrypt.hash(
        dto.passwordNueva,
        10,
      );

    await this.db.query(
      `
      UPDATE usuarios
      SET
        password_hash = $1,
        fecha_actualizacion = NOW()
      WHERE usuario_id = $2
      `,
      [
        nuevoHash,
        usuarioId,
      ],
    );

    return {
      mensaje:
        'Contraseña actualizada correctamente',
    };
  }
}