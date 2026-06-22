import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateEnvioDto {
  @IsNumber()
  direccion_origen_id!: number;

  @IsNumber()
  direccion_destino_id!: number;

  @IsString()
  descripcion_paquete!: string;

  @IsNumber()
  precio_sugerido!: number;

  @IsNumber()
  distancia_km!: number;

  @IsOptional()
  @IsNumber()
  metodo_pago_id?: number;
}