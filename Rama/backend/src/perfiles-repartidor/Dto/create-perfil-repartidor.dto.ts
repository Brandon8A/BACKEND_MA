import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePerfilRepartidorDto {

  @IsInt()
  usuario_id!: number;

  @IsInt()
  tipo_vehiculo_id!: number;

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