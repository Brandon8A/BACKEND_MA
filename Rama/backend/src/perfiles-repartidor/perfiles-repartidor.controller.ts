import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PerfilesRepartidorService } from './perfiles-repartidor.service';
import { CreatePerfilRepartidorDto } from './Dto/create-perfil-repartidor.dto';
import { DisponibilidadDto } from './Dto/disponibilidad.dto';
import { UpdatePerfilRepartidorDto } from './Dto/update-perfil-repartidor.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/Decorators/roles.decorator';

@Controller('perfiles-repartidor')
export class PerfilesRepartidorController {
  constructor(
    private readonly perfilesRepartidorService: PerfilesRepartidorService,
  ) {}

  // Crear perfil de repartidor
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @Post()
  crearPerfil(
    @Body()
    createPerfilDto: CreatePerfilRepartidorDto,
  ) {
    return this.perfilesRepartidorService.crearPerfil(
      createPerfilDto,
    );
  }

  // LIstar repartidores
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Repartidor')
  @Get()
  listarPerfiles() {
    return this.perfilesRepartidorService.listarPerfiles();
  }

  // Obtener Perfil 
  @UseGuards(JwtAuthGuard)
  @Get(':usuarioId')
  obtenerPerfil(
    @Param(
      'usuarioId',
      ParseIntPipe,
    )
    usuarioId: number,
  ) {
    return this.perfilesRepartidorService.obtenerPerfil(
      usuarioId,
    );
  }

  // Actualizar Perfil 
 @UseGuards(JwtAuthGuard)
 @Put('mi-perfil')
 actualizarMiPerfil(
   @Req() req,
   @Body() dto: UpdatePerfilRepartidorDto,
 ) {
   return this.perfilesRepartidorService
     .actualizarPerfil(
       Number(req.user.usuario_id),
       dto,
     );
 }
  
  // Cambiar Disponibilidad
  // Ruta de prueba http://localhost:3000/perfiles-repartidor/mi-perfil/disponibilidad
 @UseGuards(JwtAuthGuard)
 @Patch('mi-perfil/disponibilidad')
 cambiarDisponibilidad(
   @Req() req,
   @Body() dto: DisponibilidadDto,
 ) {
   return this.perfilesRepartidorService
     .cambiarDisponibilidad(
       Number(req.user.usuario_id),
       dto.disponible,
     );
 }
}