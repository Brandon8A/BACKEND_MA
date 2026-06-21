import {
 Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UsuariosService } from './usuarios.service';
import { UpdateProfileDto } from './Dto/update-profile.dto';

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
}