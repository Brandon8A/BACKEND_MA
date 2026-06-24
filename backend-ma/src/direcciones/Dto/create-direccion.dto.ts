import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateDireccionDto {

  @IsNumber()
  @Type(() => Number)
  municipio_id!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zona_id?: number;

  @IsString()
  @MaxLength(200)
  direccion_linea!: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @Type(() => Number)
  latitud?: number;

  @IsOptional()
  @Type(() => Number)
  longitud?: number;
}