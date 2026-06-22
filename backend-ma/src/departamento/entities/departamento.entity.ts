import { Municipio } from "../../municipio/entities/municipio.entity";

export class Departamento {
    
    departamento_id!: number

    nombre!: string;

    municipios!: Municipio[];
}
