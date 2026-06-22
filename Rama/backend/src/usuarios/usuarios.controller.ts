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

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UsuariosService } from './usuarios.service';
import { UpdateProfileDto } from './Dto/update-profile.dto';
import { CreateUserDto } from './Dto/create-user.dto';
import { Roles } from '../auth/Decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CambiarPasswordDto } from './Dto/cambiar-password.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  // Para ver el perfil y sus Datos
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getPerfil(@Req() req) {
    return this.usuariosService.obtenerPerfil(
      Number(req.user.usuario_id),
    );
  }

  // Listar Usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @Get()
  listarUsuarios() {
    return this.usuariosService.listarUsuarios();
  }
  

  //Actualizar Perfil Usuario
  @UseGuards(JwtAuthGuard)
  @Put('perfil')
  async actualizarPerfil(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usuariosService.actualizarPerfil(
      Number(req.user.usuario_id),
      updateProfileDto,
    );
  }

  //Listar usuarios por id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @Get(':id')
  obtenerUsuario(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.obtenerUsuarioPorId(
      id,
    );
  }

  // Crear Usuario con Rol Repartidor
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @Post('repartidor')
  crearRepartidor(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usuariosService.crearRepartidor(
      createUserDto,
    );
  }

  // Crear Usuario con Rol Administrador(De ser necesario)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @Post('admin')
  crearAdmin(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usuariosService.crearAdmin(
      createUserDto,
    );
  }

  // Para el admin pueda activar un usuario
  @Patch(':id/activar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  activar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.activarUsuario(id);
  }

  // Para el admin pueda desactivar un usuario
  @Patch(':id/desactivar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  desactivar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.desactivarUsuario(id);
  }

  //Cambiar Contrasenia
  @UseGuards(JwtAuthGuard)
  @Put('password')
  cambiarPassword(
    @Req() req,
    @Body() dto: CambiarPasswordDto,
  ) {
    return this.usuariosService.cambiarPassword(
      Number(req.user.usuario_id),
      dto,
    );
  }
}