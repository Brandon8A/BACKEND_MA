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
  async crear(
    dto: CreateDireccionDto,
    usuarioId: number,
  ) {

    // 1. Verificar que existe el municipio
    const municipio = await this.db.query(
      `
      SELECT municipio_id
      FROM municipios
      WHERE municipio_id = $1
      `,
      [
        dto.municipio_id
      ],
    );


    if (municipio.rows.length === 0) {
      throw new BadRequestException('El municipio no existe');
    }



    // 2. Verificar que existe la zona (si viene enviada)
    if (dto.zona_id) {

      const zona = await this.db.query(
        `
        SELECT zona_id
        FROM zonas
        WHERE zona_id = $1
        AND municipio_id = $2
        `,
        [
          dto.zona_id,
          dto.municipio_id
        ],
      );


      if (zona.rows.length === 0) {
        throw new BadRequestException(
          'La zona no existe o no pertenece al municipio seleccionado'
        );
      }
    }



    // 3. Insertar dirección
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
      RETURNING direccion_id
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


    const direccionId = result.rows[0].direccion_id;


    if (!direccionId) {
      throw new Error('No se generó direccion_id');
    }



    // 4. Relacionar usuario con dirección
    await this.db.query(
      `
      INSERT INTO usuario_direcciones(
        usuario_id,
        direccion_id
      )
      VALUES ($1,$2)
      `,
      [
        usuarioId,
        direccionId,
      ],
    );


    return {
      mensaje: 'Dirección creada correctamente',
      direccion_id: direccionId,
    };
  }

  // Listar direcciones
  async listar() {
    const result = await this.db.query(
      `
      SELECT *
      FROM direcciones
      WHERE activo = true
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

 async eliminar(id: number) {
    const result = await this.db.query(
      `
      UPDATE direcciones
      SET activo = FALSE
      WHERE direccion_id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new BadRequestException('Dirección no encontrada');
    }

    return {
      mensaje: 'Dirección desactivada',
    };
  }

  //Direcciones del Usuario Logeado
  async obtenerDireccionesCliente(
  usuarioId: number,
) {
  const result = await this.db.query(
    `
    SELECT
      d.direccion_id,
      d.direccion_linea,
      d.referencia,
      d.latitud,
      d.longitud,
      m.nombre AS municipio,
      z.nombre AS zona,
      ud.es_principal

    FROM usuario_direcciones ud

    INNER JOIN direcciones d
      ON ud.direccion_id = d.direccion_id

      INNER JOIN municipios m
        ON d.municipio_id = m.municipio_id

      LEFT JOIN zonas z
        ON d.zona_id = z.zona_id

      WHERE ud.usuario_id = $1

      ORDER BY ud.es_principal DESC,
              d.direccion_id DESC
      `,
      [usuarioId],
    );

    return result.rows;
  }
}