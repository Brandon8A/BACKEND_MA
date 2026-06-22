import { Departamento } from "../../departamento/entities/departamento.entity";
import { Zona } from "../../zona/entities/zona.entity";

export class Municipio {

    municipio_id!: number;

    nombre!: string;

    departamento_id!: number;

    departamento!: Departamento;

    zonas!: Zona[];
}
