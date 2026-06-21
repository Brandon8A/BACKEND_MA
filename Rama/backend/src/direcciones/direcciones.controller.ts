import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { DireccionesService } from './direcciones.service';
import { CreateDireccionDto } from './Dto/create-direccion.dto';
import { UpdateDireccionDto } from './Dto/update-direccion.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('direcciones')
export class DireccionesController {
  constructor(
    private readonly direccionesService: DireccionesService,
  ) {}

  // Crear dirección
  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Body() dto: CreateDireccionDto) {
    return this.direccionesService.crear(dto);
  }

  // Listar direcciones
  @UseGuards(JwtAuthGuard)
  @Get()
  listar() {
    return this.direccionesService.listar();
  }

  // Obtener por ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  obtener(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.direccionesService.obtenerPorId(id);
  }

  // Actualizar
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDireccionDto,
  ) {
    return this.direccionesService.actualizar(
      id,
      dto,
    );
  }
}