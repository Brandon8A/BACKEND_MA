import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MetodosPagoService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Crear método de pago
   */
  async create(
    createMetodoPagoDto: CreateMetodosPagoDto,
  ) {

    const query = `
      INSERT INTO metodos_pago
      (
        nombre
      )
      VALUES
      (
        $1
      )
      RETURNING *
    `;

    const result =
      await this.databaseService.query(
        query,
        [
          createMetodoPagoDto.nombre,
        ],
      );

    return result.rows[0];
  }

  /**
   * Obtener todos los métodos de pago
   */
  async findAll() {

    const query = `
      SELECT
        metodo_pago_id,
        nombre
      FROM metodos_pago
      ORDER BY metodo_pago_id
    `;

    const result =
      await this.databaseService.query(query);

    return result.rows;
  }

  /**
   * Obtener método de pago por ID
   */
  async findOne(id: number) {

    const query = `
      SELECT *
      FROM metodos_pago
      WHERE metodo_pago_id = $1
    `;

    const result =
      await this.databaseService.query(
        query,
        [id],
      );

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Método de pago ${id} no encontrado`,
      );
    }

    return result.rows[0];
  }

  /**
   * Actualizar método de pago
   */
  async update(
    id: number,
    updateMetodoPagoDto: UpdateMetodosPagoDto,
  ) {

    const metodo = await this.findOne(id);

    const query = `
      UPDATE metodos_pago
      SET
        nombre = $1
      WHERE metodo_pago_id = $2
      RETURNING *
    `;

    const result =
      await this.databaseService.query(
        query,
        [
          updateMetodoPagoDto.nombre ??
            metodo.nombre,

          id,
        ],
      );

    return result.rows[0];
  }

  /**
   * Eliminar método de pago
   */
  async remove(id: number) {

    await this.findOne(id);

    const query = `
      DELETE FROM metodos_pago
      WHERE metodo_pago_id = $1
      RETURNING *
    `;

    const result =
      await this.databaseService.query(
        query,
        [id],
      );

    return {
      mensaje:
        'Método de pago eliminado correctamente',
      data: result.rows[0],
    };
  }
}
