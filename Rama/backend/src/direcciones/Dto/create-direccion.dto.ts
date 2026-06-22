import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDireccionDto {

  @IsNumber()
  municipio_id!: number;

  @IsOptional()
  @IsNumber()
  zona_id?: number;

  @IsString()
  @MaxLength(200)
  direccion_linea!: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  latitud?: number;

  @IsOptional()
  longitud?: number;
}