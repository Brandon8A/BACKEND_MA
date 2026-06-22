import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstadosEnvioDto } from './dto/create-estados-envio.dto';
import { UpdateEstadosEnvioDto } from './dto/update-estados-envio.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EstadosEnvioService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }


  // Crear nuevo estado de envío
  async create(createEstadoEnvioDto: CreateEstadosEnvioDto,) {
    const { nombre, orden_flujo } =
      createEstadoEnvioDto;

      //Consulta sql para la creacion de un estado de envio
    const query = `
      INSERT INTO estados_envio
      (
        nombre,
        orden_flujo
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING *
    `;

    //Ejecutando query y obteniendo resultado
    const result =
      await this.databaseService.query(
        query,
        [nombre, orden_flujo],
      );

    return result.rows[0];
  }

  /**
   * Obtener todos los estados
   *
   * Se ordenan por orden_flujo para respetar
   * el flujo lógico del proceso.
   */
  async findAll() {

    //Consulta sql para obtener todos los estados de envio
    const query = `
      SELECT
        estado_id,
        nombre,
        orden_flujo
      FROM estados_envio
      ORDER BY orden_flujo ASC
    `;

    //Ejecutando query y obteniendo resultado de la query
    const result =
      await this.databaseService.query(query);

    return result.rows;
  }

  /**
   * Buscar estado por ID
   */
  async findOne(id: number) {
    //Consulta query para obtener una sola consulta por medio de su id
    const query = `
      SELECT *
      FROM estados_envio
      WHERE estado_id = $1
    `;

    //Ejecutando query y obteniendo resultado
    const result =
      await this.databaseService.query(
        query,
        [id],
      );

      //Condicional para saber si el estado de envio existe
    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Estado ${id} no encontrado`,//Lanza una excepcion indicando que el estado del envio no existe
      );
    }

    return result.rows[0];
  }

  /**
   * Actualizar estado
   */
  async update(
    id: number,
    updateEstadoEnvioDto: UpdateEstadosEnvioDto,
  ) {
    const estado = await this.findOne(id);

    const query = `
      UPDATE estados_envio
      SET
        nombre = $1,
        orden_flujo = $2
      WHERE estado_id = $3
      RETURNING *
    `;

    const result =
      await this.databaseService.query(
        query,
        [
          updateEstadoEnvioDto.nombre ??
          estado.nombre,

          updateEstadoEnvioDto.orden_flujo ??
          estado.orden_flujo,

          id,
        ],
      );

    return result.rows[0];
  }

  /**
   * Eliminar estado
   */
  async remove(id: number) {
    await this.findOne(id);

    const query = `
      DELETE FROM estados_envio
      WHERE estado_id = $1
      RETURNING *
    `;

    const result =
      await this.databaseService.query(
        query,
        [id],
      );

    return {
      mensaje:
        'Estado eliminado correctamente',
      data: result.rows[0],
    };
  }
}
