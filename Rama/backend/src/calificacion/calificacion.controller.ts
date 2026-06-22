import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

import { CalificacionesService } from './calificacion.service';

import { CreateCalificacionDto } from './Dto/create-calificacion.dto';

@Controller('calificaciones')
export class CalificacionesController {

  constructor(
    private readonly calificacionesService:
      CalificacionesService,
  ) {}

  // Crear Calificación
  @UseGuards(JwtAuthGuard)
  @Post()
  crear(
    @Req() req,
    @Body() dto: CreateCalificacionDto,
  ) {
    return this.calificacionesService
      .crearCalificacion(
        Number(req.user.usuario_id),
        dto,
      );
  }

  // Ver calificaciones de un repartidor
  @Get('repartidor/:id')
  obtenerPorRepartidor(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.calificacionesService
      .obtenerCalificacionesRepartidor(id);
  }

  // Ver promedio de un repartidor
  @Get('repartidor/:id/promedio')
  obtenerPromedio(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.calificacionesService
      .obtenerPromedioRepartidor(id);
  }
}