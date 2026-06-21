import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EnviosService } from './envios.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/Decorators/roles.decorator';
import { CreateEnvioDto } from './Dto/create-envio.dto';
import { CambiarEstadoDto } from './Dto/cambiar-estado.dto';

@Controller('envios')
export class EnviosController {
  constructor(private readonly service: EnviosService) {}


  // CLIENTE: crear envío

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Req() req, @Body() dto: CreateEnvioDto) {
    return this.service.crearEnvio(dto, req.user.usuario_id);
  }


  // REPARTIDOR: ver disponibles

  @UseGuards(JwtAuthGuard)
  @Get('disponibles')
  disponibles() {
    return this.service.enviosDisponibles();
  }


  // REPARTIDOR: aceptar envío

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Repartidor')
  @Patch(':id/aceptar')
  aceptar(@Req() req, @Param('id') id: number) {
    return this.service.aceptarEnvio(
      Number(id),
      req.user.usuario_id,
    );
  }


  // CAMBIAR ESTADO (repartidor)
  // {
  //      "estado_id":  3  // En camino , 4 = Entregado, 5 = Cancelado
  // }
 

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Repartidor')
  @Patch(':id/estado')
  cambiarEstado(
    @Req() req,
    @Param('id') id: number,
    @Body() dto: CambiarEstadoDto,
  ) {
    return this.service.cambiarEstado(
      Number(id),
      dto,
      req.user.usuario_id,
    );
  }


  // DETALLE ENVÍO

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  detalle(@Param('id') id: number) {
    return this.service.detalleEnvio(Number(id));
  }

 
  // HISTORIAL ENVÍO

  @UseGuards(JwtAuthGuard)
  @Get(':id/historial')
  historial(@Param('id') id: number) {
    return this.service.historialEnvio(Number(id));
  }
}