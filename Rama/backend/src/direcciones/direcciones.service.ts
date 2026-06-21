import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDireccionDto } from './Dto/create-direccion.dto';
import { UpdateDireccionDto } from './Dto/update-direccion.dto';

@Injectable()
export class DireccionesService {
  constructor(
    private readonly db: DatabaseService,
  ) {}

  // Crear dirección
  async crear(dto: CreateDireccionDto) {

    const municipio = await this.db.query(
      `
      SELECT municipio_id
      FROM municipios
      WHERE municipio_id = $1
      `,
      [dto.municipio_id],
    );

    if (municipio.rows.length === 0) {
      throw new BadRequestException(
        'Municipio no válido',
      );
    }

    if (dto.zona_id) {
      const zona = await this.db.query(
        `
        SELECT zona_id
        FROM zonas
        WHERE zona_id = $1
        `,
        [dto.zona_id],
      );

      if (zona.rows.length === 0) {
        throw new BadRequestException(
          'Zona no válida',
        );
      }
    }

    const result = await this.db.query(
      `
      INSERT INTO direcciones (
        municipio_id,
        zona_id,
        direccion_linea,
        referencia,
        latitud,
        longitud
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        dto.municipio_id,
        dto.zona_id ?? null,
        dto.direccion_linea,
        dto.referencia ?? null,
        dto.latitud ?? null,
        dto.longitud ?? null,
      ],
    );

    return {
      mensaje: 'Dirección creada correctamente',
      direccion: result.rows[0],
    };
  }

  // Listar direcciones
  async listar() {
    const result = await this.db.query(
      `
      SELECT *
      FROM direcciones
      ORDER BY direccion_id DESC
      `,
    );

    return result.rows;
  }

  // Obtener por ID
  async obtenerPorId(id: number) {
    const result = await this.db.query(
      `
      SELECT *
      FROM direcciones
      WHERE direccion_id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException(
        'Dirección no encontrada',
      );
    }

    return result.rows[0];
  }

  // Actualizar
  async actualizar(
    id: number,
    dto: UpdateDireccionDto,
  ) {
    const result = await this.db.query(
      `
      UPDATE direcciones
      SET
        municipio_id = COALESCE($1, municipio_id),
        zona_id = COALESCE($2, zona_id),
        direccion_linea = COALESCE($3, direccion_linea),
        referencia = COALESCE($4, referencia),
        latitud = COALESCE($5, latitud),
        longitud = COALESCE($6, longitud)
      WHERE direccion_id = $7
      RETURNING *
      `,
      [
        dto.municipio_id,
        dto.zona_id,
        dto.direccion_linea,
        dto.referencia,
        dto.latitud,
        dto.longitud,
        id,
      ],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException(
        'Dirección no encontrada',
      );
    }

    return {
      mensaje: 'Dirección actualizada correctamente',
      direccion: result.rows[0],
    };
  }

  // ELIMINAR
  async eliminar(id: number) {
    const result = await this.db.query(
      `DELETE FROM direcciones WHERE direccion_id = $1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException('Dirección no encontrada');
    }

    return {
      mensaje: 'Dirección eliminada',
    };
  }
}