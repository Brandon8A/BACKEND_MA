import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateEnvioDto } from './Dto/create-envio.dto';
import { CambiarEstadoDto } from './Dto/cambiar-estado.dto';

@Injectable()
export class EnviosService {
  constructor(private readonly db: DatabaseService) {}


  //  CREAR ENVÍO (CLIENTE)
  
  async crearEnvio(dto: CreateEnvioDto, clienteId: number) {

    // validar direcciones
    const direcciones = await this.db.query(
      `
      SELECT direccion_id
      FROM direcciones
      WHERE direccion_id IN ($1,$2)
      `,
      [
        dto.direccion_origen_id,
        dto.direccion_destino_id,
      ],
    );

    if (direcciones.rows.length < 2) {
      throw new BadRequestException(
        'Direcciones inválidas',
      );
    }

    // validar método de pago
    if (dto.metodo_pago_id) {
      const metodo = await this.db.query(
        `
        SELECT metodo_pago_id
        FROM metodos_pago
        WHERE metodo_pago_id = $1
        `,
        [dto.metodo_pago_id],
      );

      if (!metodo.rows.length) {
        throw new BadRequestException(
          'Método de pago inválido',
        );
      }
    }

    // estado pendiente
    const estado = await this.db.query(
      `
      SELECT estado_id
      FROM estados_envio
      WHERE nombre = 'Pendiente'
      `,
    );

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
        estado.rows[0].estado_id,
      ],
    );

    return {
      mensaje: 'Envío creado correctamente',
      envio_id: result.rows[0].envio_id,
    };
  }

  // ENVÍOS DISPONIBLES
  
  async enviosDisponibles() {
    const result = await this.db.query(`
      SELECT * FROM vista_pedidos_disponibles
    `);

    return result.rows;
  }

  
  // ACEPTAR ENVÍO (MATCH)
  
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


  // CAMBIAR ESTADO

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

    // El historial ya lo maneja el TRIGGER
    return {
      mensaje: 'Estado actualizado correctamente',
      envio: result.rows[0],
    };
  }


  //  DETALLE ENVÍO

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

 
  //  HISTORIAL ENVÍO

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