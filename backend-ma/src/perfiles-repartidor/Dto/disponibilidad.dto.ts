import { IsBoolean } from 'class-validator';

export class DisponibilidadDto {

  @IsBoolean()
  disponible!: boolean;
}