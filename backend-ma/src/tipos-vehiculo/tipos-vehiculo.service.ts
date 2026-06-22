import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTiposVehiculoDto } from './dto/create-tipos-vehiculo.dto';
import { UpdateTiposVehiculoDto } from './dto/update-tipos-vehiculo.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TiposVehiculoService {
  constructor(
    private readonly db: DatabaseService
  ) { }

  //Funcion para crear un nuevo tipo de vehiculo
  async create(createTipoVehiculoDto: CreateTiposVehiculoDto) {

    //Consulta sql para verificar la existencia del vehiculo
    const existe = await this.db.query(
      `SELECT 1
             FROM tipos_vehiculo
             WHERE nombre=$1`,
      [createTipoVehiculoDto.nombre]
    );

    //Condicional para verificar si el vehiculo existe
    if (existe.rows.length > 0)
      throw new ConflictException("El tipo de vehículo ya existe.");//Lanza una excepcion indicando que el vehiculo ya existe

    //Consulta sql para agregar el vehiculo en la db
    const sql = `
            INSERT INTO tipos_vehiculo(nombre)
            VALUES($1)
            RETURNING *;
        `;

        //Ejecutando query
    const result = await this.db.query(sql, [
      createTipoVehiculoDto.nombre
    ]);

    return result.rows[0];
  }

  //Funcion que obtiene todos los vehiculos alamcenados en la db
  async findAll() {

    //Consulta sql para obtener todos los vehiculos almacenados en la db
    const sql = `
            SELECT
                tipo_vehiculo_id,
                nombre
            FROM tipos_vehiculo
            ORDER BY tipo_vehiculo_id;
        `;

    const result = await this.db.query(sql);

    return result.rows;
  }

  //Funcion que permite obtener un solo vehiculo por medio de su id
  async findOne(id: number) {

    //Consulta sql para obtener vehiculo por medio de su id pasado por parametro
    const sql = `
            SELECT
                tipo_vehiculo_id,
                nombre
            FROM tipos_vehiculo
            WHERE tipo_vehiculo_id=$1;
        `;

        //Ejecutando y obteniendo consulta sql
    const result = await this.db.query(sql, [id]);

    //Condicional para saber si el vehiculo existe
    if (result.rows.length == 0)
      throw new NotFoundException("Tipo de vehículo no encontrado.");//Lanza una excepcion indicando que el vehiculo no existe

    return result.rows[0];
  }

  //Funcion para actualizar un vehiculo por medio de su id
  async update(id: number, updateTipoVehiculoDto: UpdateTiposVehiculoDto) {

    //Consulta sql para la actualizacion de un vehiculo por medio de su id
    const sql = `
            UPDATE tipos_vehiculo
            SET nombre=$1
            WHERE tipo_vehiculo_id=$2
            RETURNING *;
        `;

        //Obteniendo y ejecutando consulta sql
    const result = await this.db.query(sql, [
      updateTipoVehiculoDto.nombre,
      id
    ]);

    //Condicionara para saber si el vehiculo existe
    if (result.rows.length == 0)
      throw new NotFoundException("Tipo de vehículo no encontrado.");//Lanza una excepcion indicando que el vehiculo no existe

    return result.rows[0];
  }

  //Funcion para eliminar un vehiculo por medio de su id
  async remove(id: number) {

    //Consulta sql para la eliminacion del vehiculo
    const sql = `
            DELETE FROM tipos_vehiculo
            WHERE tipo_vehiculo_id=$1
            RETURNING *;
        `;

        //Ejecutando consulta sql
    const result = await this.db.query(sql, [id]);

    //Condicional para saber si el vehiculo existe
    if (result.rows.length == 0)
      throw new NotFoundException("Tipo de vehículo no encontrado.");//Lanza una excepcion indicando que el vehiculo no existe

    return {
      message: "Tipo de vehículo eliminado correctamente."
    };
  }
}
