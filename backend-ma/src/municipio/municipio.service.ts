import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MunicipioService {

  constructor(
    private readonly db: DatabaseService
  ) { }

  //Funcion para crear un municipo
  async create(dto: CreateMunicipioDto) {

    //Consulta sql para la crear y almacenar un municipio en la base de datos, los datos se obtienen del dto
    const sql = `
        INSERT INTO municipios(nombre, departamento_id)
        VALUES($1,$2)
        RETURNING *;
    `;

    const result = await this.db.query(sql, [
      //Mandando la informacion para que se almacene en la db
      dto.nombre,
      dto.departamento_id
    ]);

    return result.rows[0];
  }

  //Funcion para listar/obtener todos los municipios
  async findAll() {

    //Consulta sql para obtener sierta informacion de todos los municipios
    const sql = `
        SELECT
            m.municipio_id,
            m.nombre,
            d.departamento_id,
            d.nombre AS departamento
        FROM municipios m
        INNER JOIN departamentos d
            ON d.departamento_id=m.departamento_id
        ORDER BY m.municipio_id;
    `;

    const result = await this.db.query(sql);

    return result.rows;
  }

  //Función para buscar un solo municipio
  async findOne(id: number) {

    //Consulta sql para la obtencion del municipio que coincida con el id pasado por parametro
    const sql = `
        SELECT
            m.*,
            d.nombre AS departamento
        FROM municipios m
        INNER JOIN departamentos d
            ON d.departamento_id=m.departamento_id
        WHERE municipio_id=$1;
    `;

    const result = await this.db.query(sql, [id]);

    if (result.rows.length == 0)
      throw new NotFoundException();

    return result.rows[0];
  }

  //Funcion que actualiza un municipio, dicho municipio es mandado el id para la actualizacion
  async update(id: number, dto: UpdateMunicipioDto) {

    const sql = `
        UPDATE municipios
        SET
            nombre=$1,
            departamento_id=$2
        WHERE municipio_id=$3
        RETURNING *;
    `;

    const result = await this.db.query(sql, [
      dto.nombre,
      dto.departamento_id,
      id
    ]);

    //Condicional para saber si existe el municipio 
    if (result.rows.length == 0)
      throw new NotFoundException();//Lanza una excepcion ya que no se encontro el municipio

    return result.rows[0];
  }

  //Funcion que elimina un municipio
  async remove(id: number) {

    //Consulta sql
    const sql = `
        DELETE FROM municipios
        WHERE municipio_id=$1
        RETURNING *;
    `;

    const result = await this.db.query(sql, [id]);

    //Condicional para saber si existe el municipio a eliminar
    if (result.rows.length == 0)
      throw new NotFoundException();//Lanza una excepcin por que no se encontro el municipio

    return {
      message: "Municipio eliminado"
    };
  }
}
