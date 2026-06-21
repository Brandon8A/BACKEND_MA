import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePerfilRepartidorDto } from './Dto/create-perfil-repartidor.dto';
import { UpdatePerfilRepartidorDto } from './Dto/update-perfil-repartidor.dto';

@Injectable()
export class PerfilesRepartidorService {
  constructor(
    private readonly db: DatabaseService,
  ) {}

  // Crear el Perfil de Repartidor
  async crearPerfil(
    createPerfilDto: CreatePerfilRepartidorDto,
  ) {

    // Verificar que el usuario exista
    const usuario = await this.db.query(
      `
      SELECT usuario_id
      FROM usuarios
      WHERE usuario_id = $1
      `,
      [createPerfilDto.usuario_id],
    );

    if (usuario.rows.length === 0) {
      throw new BadRequestException(
        'El usuario no existe',
      );
    }

    // Verificar que tenga rol Repartidor
    const rol = await this.db.query(
      `
      SELECT r.nombre_rol
      FROM usuario_roles ur
      INNER JOIN roles r
        ON ur.rol_id = r.rol_id
      WHERE ur.usuario_id = $1
      `,
      [createPerfilDto.usuario_id],
    );

    if (
      rol.rows.length === 0 ||
      rol.rows[0].nombre_rol !== 'Repartidor'
    ) {
      throw new BadRequestException(
        'El usuario no tiene rol Repartidor',
      );
    }

    // Verificar que no tenga perfil creado
    const perfilExistente = await this.db.query(
      `
      SELECT usuario_id
      FROM perfiles_repartidor
      WHERE usuario_id = $1
      `,
      [createPerfilDto.usuario_id],
    );

    if (perfilExistente.rows.length > 0) {
      throw new BadRequestException(
        'El perfil de repartidor ya existe',
      );
    }

    // Verificar que el tipo de vehículo exista
    const vehiculo = await this.db.query(
      `
      SELECT tipo_vehiculo_id
      FROM tipos_vehiculo
      WHERE tipo_vehiculo_id = $1
      `,
      [createPerfilDto.tipo_vehiculo_id],
    );

    if (vehiculo.rows.length === 0) {
      throw new BadRequestException(
        'El tipo de vehículo no existe',
      );
    }

    // Crear perfil
    const result = await this.db.query(
      `
      INSERT INTO perfiles_repartidor (
        usuario_id,
        tipo_vehiculo_id,
        placa,
        marca,
        modelo,
        color
      )
      VALUES (
        $1,$2,$3,$4,$5,$6
      )
      RETURNING *
      `,
      [
        createPerfilDto.usuario_id,
        createPerfilDto.tipo_vehiculo_id,
        createPerfilDto.placa,
        createPerfilDto.marca,
        createPerfilDto.modelo,
        createPerfilDto.color,
      ],
    );

    return {
      mensaje: 'Perfil de repartidor creado correctamente',
      perfil: result.rows[0],
    };
  }

  // Lista los Repartidores
  async listarPerfiles() {
   const result = await this.db.query(
    `
     SELECT
       pr.usuario_id,
       u.nombres,
       u.apellidos,
       tv.nombre AS tipo_vehiculo,
       pr.placa,
       pr.marca,
       pr.modelo,
       pr.color,
       pr.calificacion_promedio,
       pr.total_calificaciones,
       pr.disponible
     FROM perfiles_repartidor pr
     INNER JOIN usuarios u
       ON pr.usuario_id = u.usuario_id
     INNER JOIN tipos_vehiculo tv
       ON pr.tipo_vehiculo_id = tv.tipo_vehiculo_id
     ORDER BY u.nombres
     `,
   );

   return result.rows;
 }

 // Obtener el perfil del Repartidor
 async obtenerPerfil(usuarioId: number) {

   const result = await this.db.query(
     `
     SELECT
       pr.usuario_id,
       u.nombres,
       u.apellidos,
       u.email,
       u.telefono,
       tv.nombre AS tipo_vehiculo,
       pr.placa,
       pr.marca,
       pr.modelo,
       pr.color,
       pr.calificacion_promedio,
       pr.total_calificaciones,
       pr.disponible
     FROM perfiles_repartidor pr
     INNER JOIN usuarios u
       ON pr.usuario_id = u.usuario_id
     INNER JOIN tipos_vehiculo tv
       ON pr.tipo_vehiculo_id = tv.tipo_vehiculo_id
     WHERE pr.usuario_id = $1
     `,
     [usuarioId],
   );

   if (result.rows.length === 0) {
     throw new BadRequestException(
       'Perfil de repartidor no encontrado',
     );
   }

   return result.rows[0];
 }

 // Actualizar Perfil 
 async actualizarPerfil(
   usuarioId: number,
   updateDto: UpdatePerfilRepartidorDto,
 ) {

   // 1. validar rol
   const rol = await this.db.query(
     `
     SELECT r.nombre_rol
     FROM usuario_roles ur
     INNER JOIN roles r ON r.rol_id = ur.rol_id
     WHERE ur.usuario_id = $1
     `,
     [usuarioId],
   );

   if (rol.rows[0]?.nombre_rol !== 'Repartidor') {
     throw new BadRequestException('Este usuario no es repartidor');
   }

   // 2. verificar que exista perfil
   const perfil = await this.db.query(
     `
     SELECT usuario_id
     FROM perfiles_repartidor
     WHERE usuario_id = $1
     `,
     [usuarioId],
   );

   if (perfil.rows.length === 0) {
     throw new BadRequestException('Perfil de repartidor no encontrado');
   }

   // 3. validar vehículo solo si viene
   if (updateDto.tipo_vehiculo_id !== undefined && updateDto.tipo_vehiculo_id !== null) {

     const vehiculo = await this.db.query(
       `
       SELECT tipo_vehiculo_id
       FROM tipos_vehiculo
       WHERE tipo_vehiculo_id = $1
       `,
       [updateDto.tipo_vehiculo_id],
     );

     if (vehiculo.rows.length === 0) {
       throw new BadRequestException('El tipo de vehículo no existe');
     }
   }

   // 4. update
   const result = await this.db.query(
     `
     UPDATE perfiles_repartidor
     SET
       tipo_vehiculo_id = COALESCE($1, tipo_vehiculo_id),
       placa = COALESCE($2, placa),
       marca = COALESCE($3, marca),
       modelo = COALESCE($4, modelo),
       color = COALESCE($5, color)
     WHERE usuario_id = $6
     RETURNING *
     `,
     [
       updateDto.tipo_vehiculo_id,
       updateDto.placa,
       updateDto.marca,
       updateDto.modelo,
       updateDto.color,
       usuarioId,
     ],
   );

   return {
     mensaje: 'Perfil actualizado correctamente',
     perfil: result.rows[0],
   };
 }

 // Cambiar Disponibilidad
 async cambiarDisponibilidad(
   usuarioId: number,
   disponible: boolean,
 ) {

   const result = await this.db.query(
     `
     UPDATE perfiles_repartidor
     SET disponible = $1
     WHERE usuario_id = $2
     RETURNING *
     `,
     [
       disponible,
       usuarioId,
     ],
   );

   if (result.rows.length === 0) {
     throw new BadRequestException(
       'Perfil de repartidor no encontrado',
     );
   }

   return {
     mensaje: disponible
       ? 'Repartidor disponible'
       : 'Repartidor no disponible',
     perfil: result.rows[0],
   };
  }
}