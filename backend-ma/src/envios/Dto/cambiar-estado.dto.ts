import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CambiarEstadoDto {
  @IsNumber()
  estado_id!: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}