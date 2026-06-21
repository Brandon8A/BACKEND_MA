import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePerfilRepartidorDto {

  @IsOptional()
  @IsInt()
  tipo_vehiculo_id?: number;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  color?: string;
}