import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ZonaService {

  constructor(
    private readonly db: DatabaseService
  ) { }

  //Funcion que crea una nueva zona
  async create(dto: CreateZonaDto) {

    const sql = `
        INSERT INTO zonas(nombre, municipio_id)
        VALUES($1,$2)
        RETURNING *;
    `;

    const result = await this.db.query(sql, [
      dto.nombre,
      dto.municipio_id
    ]);

    return result.rows[0];
  }

  //Funcion que obtiene todas las zonas
  async findAll() {

    //Consulta sql
    const sql = `
        SELECT

            z.zona_id,
            z.nombre,

            m.municipio_id,
            m.nombre AS municipio,

            d.departamento_id,
            d.nombre AS departamento

        FROM zonas z

        INNER JOIN municipios m
            ON m.municipio_id=z.municipio_id

        INNER JOIN departamentos d
            ON d.departamento_id=m.departamento_id

        ORDER BY z.zona_id;
    `;

    const result = await this.db.query(sql);//Ejecutano query y obteniendo la informacion

    return result.rows;//Retornando informacion obtenida
  }

  //Funcion que obtiene una sola zona, la zona a obtener es por medio de su id
  async findOne(id: number) {

    //Consulta sql
    const sql = `
      SELECT

        z.zona_id,
        z.nombre,

        m.municipio_id,
        m.nombre AS municipio,

        d.departamento_id,
        d.nombre AS departamento

      FROM zonas z

      INNER JOIN municipios m
        ON m.municipio_id = z.municipio_id

      INNER JOIN departamentos d
        ON d.departamento_id = m.departamento_id

      WHERE z.zona_id = $1;
    `;

    const result = await this.db.query(sql, [id]);

    //Condicional para verificar si el id de la zona existe
    if (result.rows.length == 0)
      throw new NotFoundException('Zona no encontrada');//Lanza una excepcion indicanco que la zona no existe

    return result.rows[0];
  }

  //Funcion que actualiza una zona
  async update(id: number, updateZonaDto: UpdateZonaDto) {

    //Consulta sql
    const sql = `
      UPDATE zonas
      SET
        nombre = $1,
        municipio_id = $2
      WHERE zona_id = $3
      RETURNING *;
    `;

    //Se ejecuta la consulta, y se mandan los datos actualizados
    const result = await this.db.query(sql, [
      updateZonaDto.nombre,
      updateZonaDto.municipio_id,
      id
    ]);

    //Condicional para saber si existe la zona
    if (result.rows.length == 0)
      throw new NotFoundException('Zona no encontrada');//Lanza una excepcion indicando que la zona no existe

    return result.rows[0];
  }

  //Funcion que elimina una zona
  async remove(id: number) {

    //Consulta sql
    const sql = `
      DELETE FROM zonas
      WHERE zona_id = $1
      RETURNING *;
    `;

    const result = await this.db.query(sql, [id]);

    //Condicional para saber si existe la zona
    if (result.rows.length == 0)
      throw new NotFoundException('Zona no encontrada');//Lanza una excepcion indicando que la zona no existe

    return {
      message: 'Zona eliminada correctamente'
    };
  }
}
