import { Municipio } from "src/municipio/entities/municipio.entity";

export class Departamento {
    
    departamento_id!: number

    nombre!: string;

    municipios!: Municipio[];
}
