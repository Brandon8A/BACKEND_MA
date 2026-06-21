import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DepartamentoService {

  constructor(
    private readonly db: DatabaseService
  ) { }

  //Funcion para crear departamento
  async create(dto: CreateDepartamentoDto) {

    //Consulta sql para el insertar un departamento en la db
    const sql = `
            INSERT INTO departamentos(nombre)
            VALUES($1)
            RETURNING *;
        `;

    const result = await this.db.query(sql, [
      dto.nombre
    ]);

    return result.rows[0];
  }

  //Funcion para obtener todos los departamentos
  async findAll() {

    //Consulta sql para obtener todos los departamentos
    const sql = `
            SELECT *
            FROM departamentos
            ORDER BY departamento_id;
        `;

    const result = await this.db.query(sql);

    console.log(result)

    return result.rows;
  }

  //Funcion que obtiene un departamento, este departamento se obtiene por medio de su id que es pasado por parametro
  async findOne(id: number) {

    //Consulta sql para obtener el departamento que coincida con el id pasado por parametro
    const sql = `
            SELECT *
            FROM departamentos
            WHERE departamento_id=$1;
        `;

    const result = await this.db.query(sql, [id]);

    //Condicional para verificar que el id del departamento a buscar si exista
    if (result.rows.length == 0)
      throw new NotFoundException('Departamento no encontrado');//Lanza una excepcion indicando que el id del departamento no existe

    return result.rows[0];
  }

  //Funcion para actualizar un departamento, el departamento a buscar seria el parametro id, mientras que el dto seria el objeto que trae los datos con los cuales se va a actualizar el departamento.
  async update(id: number, dto: UpdateDepartamentoDto) {

    //Consulta sql para la actualizacion del departamento
    const sql = `
            UPDATE departamentos
            SET nombre=$1
            WHERE departamento_id=$2
            RETURNING *;
        `;

    const result = await this.db.query(sql, [
      dto.nombre,
      id
    ]);

    //Condicion para verificar si el id del departamento existe
    if (result.rows.length == 0)
      throw new NotFoundException('Departamento no encontrado');//Lanza una excepcion indicando que el departamento a actualizar no existe

    return result.rows[0];
  }

  //Funcion para eliminar un departamento
  async remove(id: number) {

    //Consulta sql para eliminar departamento por medio de su id que es pasado por parametro
    const sql = `
            DELETE FROM departamentos
            WHERE departamento_id=$1
            RETURNING *;
        `;

    const result = await this.db.query(sql, [id]);

    //Condicional para vaerificar si el departamento existe o no
    if (result.rows.length == 0)
      throw new NotFoundException('Departamento no encontrado');//Lanza una excepcion indicando que el departamento no existe

    return {
      message: 'Departamento eliminado'
    };
  }
}
