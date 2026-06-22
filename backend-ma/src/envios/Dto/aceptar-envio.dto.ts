import { IsNumber } from 'class-validator';

export class AceptarEnvioDto {
  @IsNumber()
  envio_id!: number;
}