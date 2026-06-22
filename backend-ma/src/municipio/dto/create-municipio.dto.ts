//DTO para la creacion de un municipio
export class CreateMunicipioDto {
    nombre!: string;//Nombre del Municipio a crear

    departamento_id!: number;//id del Departamento al que pertenece este municipio
}
