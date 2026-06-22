import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { CreateCalificacionDto } from './Dto/create-calificacion.dto';

@Injectable()
export class CalificacionesService {

  constructor(
    private readonly db: DatabaseService,
  ) {}

  // Crear Calificación
  async crearCalificacion(
   clienteId: number,
   dto: CreateCalificacionDto,
 ) {

   const envio = await this.db.query(
     `
     SELECT
      e.envio_id,
      e.cliente_id,
      e.repartidor_id,
      es.nombre AS estado
     FROM envios e
     INNER JOIN estados_envio es
      ON e.estado_id = es.estado_id
     WHERE e.envio_id = $1
     `,
     [dto.envio_id],
   );

   if (envio.rows.length === 0) {
     throw new BadRequestException(
       'Envío no encontrado',
     );
   }

   if (
     Number(envio.rows[0].cliente_id) !==
     clienteId
   ) {
     throw new BadRequestException(
       'No puede calificar este envío',
     );
   }

   if (
     envio.rows[0].estado !==
     'Entregado'
   ) {
     throw new BadRequestException(
       'Solo se pueden calificar envíos entregados',
     );
   }

   const existe = await this.db.query(
     `
     SELECT calificacion_id
     FROM calificaciones
     WHERE envio_id = $1
     `,
     [dto.envio_id],
   );

   if (existe.rows.length > 0) {
     throw new BadRequestException(
       'Este envío ya fue calificado',
     );
   }

   const result = await this.db.query(
     `
     INSERT INTO calificaciones (
       envio_id,
       cliente_id,
       repartidor_id,
       puntuacion,
       comentario
     )
     VALUES (
       $1,$2,$3,$4,$5
     )
     RETURNING *
     `,
     [
       dto.envio_id,
       clienteId,
       envio.rows[0].repartidor_id,
       dto.puntuacion,
       dto.comentario ?? null,
     ],
   );

   return {
     mensaje:
       'Calificación registrada correctamente',
     calificacion: result.rows[0],
   };
 }

  // Listar calificaciones de un repartidor
  async obtenerCalificacionesRepartidor(
    repartidorId: number,
  ) {

  const result = await this.db.query(
    `
    SELECT
      calificacion_id,
      envio_id,
      cliente_id,
      repartidor_id,
      puntuacion,
      comentario,
      fecha_calificacion
    FROM calificaciones
    WHERE repartidor_id = $1
    ORDER BY fecha_calificacion DESC
    `,
    [repartidorId],
  );

    return result.rows;
  }

  // Obtener promedio del repartidor
  async obtenerPromedioRepartidor(
    repartidorId: number,
  ) {

    const result = await this.db.query(
      `
      SELECT
        usuario_id,
        calificacion_promedio,
        total_calificaciones
      FROM perfiles_repartidor
      WHERE usuario_id = $1
      `,
      [repartidorId],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException(
        'Repartidor no encontrado',
      );
    }

    return result.rows[0];
  }
}