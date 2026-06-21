import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateEnvioDto } from './Dto/create-envio.dto';
import { CambiarEstadoDto } from './Dto/cambiar-estado.dto';

@Injectable()
export class EnviosService {
  constructor(private readonly db: DatabaseService) {}

  // =========================
  // 1. CREAR ENVÍO (CLIENTE)
  // =========================
  async crearEnvio(dto: CreateEnvioDto, clienteId: number) {
    const result = await this.db.query(
      `
      INSERT INTO envios (
        cliente_id,
        direccion_origen_id,
        direccion_destino_id,
        descripcion_paquete,
        precio_sugerido,
        distancia_km,
        metodo_pago_id,
        estado_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING envio_id
      `,
      [
        clienteId,
        dto.direccion_origen_id,
        dto.direccion_destino_id,
        dto.descripcion_paquete,
        dto.precio_sugerido,
        dto.distancia_km,
        dto.metodo_pago_id ?? null,
        1, // PENDIENTE
      ],
    );

    return {
      mensaje: 'Envío creado correctamente',
      envio_id: result.rows[0].envio_id,
    };
  }

  // =========================
  // 2. ENVÍOS DISPONIBLES
  // =========================
  async enviosDisponibles() {
    const result = await this.db.query(`
      SELECT * FROM vista_pedidos_disponibles
    `);

    return result.rows;
  }

  // =========================
  // 3. ACEPTAR ENVÍO (MATCH)
  // =========================
  async aceptarEnvio(envioId: number, repartidorId: number) {

    const result = await this.db.query(
      `
      UPDATE envios
      SET repartidor_id = $1,
          estado_id = 2,
          fecha_aceptacion = NOW()
      WHERE envio_id = $2
        AND repartidor_id IS NULL
      RETURNING *
      `,
      [repartidorId, envioId],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException(
        'El envío ya fue asignado o no existe',
      );
    }

    return {
      mensaje: 'Envío aceptado correctamente',
      envio: result.rows[0],
    };
  }

  // =========================
  // 4. CAMBIAR ESTADO
  // =========================
  async cambiarEstado(
    envioId: number,
    dto: CambiarEstadoDto,
    usuarioId: number,
  ) {
    const result = await this.db.query(
      `
      UPDATE envios
      SET estado_id = $1,
          fecha_actualizacion = NOW()
      WHERE envio_id = $2
      RETURNING *
      `,
      [dto.estado_id, envioId],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException('Envío no encontrado');
    }

    // El historial ya lo maneja tu TRIGGER ✔️
    return {
      mensaje: 'Estado actualizado correctamente',
      envio: result.rows[0],
    };
  }

  // =========================
  // 5. DETALLE ENVÍO
  // =========================
  async detalleEnvio(envioId: number) {
    const result = await this.db.query(
      `
      SELECT * FROM vista_resumen_envio
      WHERE envio_id = $1
      `,
      [envioId],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException('Envío no encontrado');
    }

    return result.rows[0];
  }

  // =========================
  // 6. HISTORIAL ENVÍO
  // =========================
  async historialEnvio(envioId: number) {
    const result = await this.db.query(
      `
      SELECT *
      FROM envio_historial_estados
      WHERE envio_id = $1
      ORDER BY fecha_cambio ASC
      `,
      [envioId],
    );

    return result.rows;
  }
}