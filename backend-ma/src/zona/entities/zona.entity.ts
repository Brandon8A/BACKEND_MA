import { Municipio } from "src/municipio/entities/municipio.entity";

export class Zona {
    
    zona_id!: number;

    nombre!: string;

    municipio_id!: number;

    municipio!: Municipio;
}
