import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadosEnvioDto } from './create-estados-envio.dto';

export class UpdateEstadosEnvioDto extends PartialType(CreateEstadosEnvioDto) {}
