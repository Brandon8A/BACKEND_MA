import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposVehiculoDto } from './create-tipos-vehiculo.dto';

export class UpdateTiposVehiculoDto extends PartialType(CreateTiposVehiculoDto) {}
