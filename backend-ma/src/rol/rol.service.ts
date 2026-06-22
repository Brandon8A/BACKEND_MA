import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RolService {
  constructor(
    private readonly db: DatabaseService,
  ) { }

  //Funcion que permite crear un rol
  async create(createRoleDto: CreateRolDto) {

    //Consulta sql para verificar si un rol ya existe en la base de datos
    const existe = await this.db.query(
      `SELECT 1
             FROM roles
             WHERE nombre_rol = $1`,
      [createRoleDto.nombre_rol]
    );

    //Condicional para corroborar la existencia del nuevo rol
    if (existe.rows.length > 0) {
      throw new ConflictException('El rol ya existe.');//Lanza una excepcion indicando que el rol ya existe
    }

    //Consulta sql para agregar un rol a la db
    const sql = `
            INSERT INTO roles(nombre_rol)
            VALUES($1)
            RETURNING *;
        `;

    //Ejecutando query
    const result = await this.db.query(sql, [
      createRoleDto.nombre_rol
    ]);

    return result.rows[0];
  }

  //Funcion para obtener todos los roles almacenados en la db
  async findAll() {

    //Consulta sql para la obtencion de todos los roles
    const sql = `
            SELECT
                rol_id,
                nombre_rol
            FROM roles
            ORDER BY rol_id;
        `;

    const result = await this.db.query(sql);

    return result.rows;
  }

  //Funcion para obtener un solo rol
  async findOne(id: number) {

    //Consulta sql para la obtencion del rol
    const sql = `
            SELECT
                rol_id,
                nombre_rol
            FROM roles
            WHERE rol_id = $1;
        `;

    const result = await this.db.query(sql, [id]);

    //Condicional para saber si el rol a buscar existe o no
    if (result.rows.length == 0)
      throw new NotFoundException('Rol no encontrado.');//Retorna una excepcion indicando que el rol no existe

    return result.rows[0];
  }

  //Funcion que actualiza un rol en especifico por medio del id del rol
  async update(id: number, updateRoleDto: UpdateRolDto) {

    //Consulta sql para la actualizacion del rol
    const sql = `
            UPDATE roles
            SET nombre_rol = $1
            WHERE rol_id = $2
            RETURNING *;
        `;

        //Ejecutando consulta sql
    const result = await this.db.query(sql, [
      updateRoleDto.nombre_rol,
      id
    ]);

    //Condicional para verificar si el rol existe
    if (result.rows.length == 0)
      throw new NotFoundException('Rol no encontrado.');//Lanza una excepcion indicando que el rol no existe

    return result.rows[0];
  }

  //Funcion para eliminar un rol por medio de su id
  async remove(id: number) {

    //Consulta sql para la eliminacion del rol
    const sql = `
            DELETE FROM roles
            WHERE rol_id = $1
            RETURNING *;
        `;

        //Ejecutando consulta sql
    const result = await this.db.query(sql, [id]);

    //Condicional para saber si el rol existe
    if (result.rows.length == 0)
      throw new NotFoundException('Rol no encontrado.');//Lanza una excepcion indicanco que el rol no existe

    return {
      message: 'Rol eliminado correctamente.'
    };
  }
}
