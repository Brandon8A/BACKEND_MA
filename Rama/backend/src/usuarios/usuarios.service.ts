import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './Dto/update-profile.dto';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly db: DatabaseService,
  ) {}

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

   return result.rows[0];
 }
}