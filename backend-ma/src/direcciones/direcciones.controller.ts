import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
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
  crear(@Body() dto: CreateDireccionDto, @Req() req) {
  console.log('REQ USER:', req.user);
  return this.direccionesService.crear(dto, req.user.usuario_id);
}

  // Listar direcciones
  @UseGuards(JwtAuthGuard)
  @Get()
  listar() {
    return this.direccionesService.listar();
  }

   // Direccione del Usuario Logeado
  @UseGuards(JwtAuthGuard)
  @Get('mis-direcciones')
  misDirecciones(
    @Req() req,
  ) {
    return this.direccionesService.obtenerDireccionesCliente(
      req.user.usuario_id,
    );
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

  // Eliminar Direccion
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.eliminar(id);
  }

 
}
