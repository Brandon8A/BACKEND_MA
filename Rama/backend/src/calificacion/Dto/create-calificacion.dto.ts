import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCalificacionDto {

  @IsInt()
  envio_id!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion!: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  comentario?: string;
}