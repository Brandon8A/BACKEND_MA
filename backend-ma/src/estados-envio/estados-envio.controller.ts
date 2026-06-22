import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstadosEnvioService } from './estados-envio.service';
import { CreateEstadosEnvioDto } from './dto/create-estados-envio.dto';
import { UpdateEstadosEnvioDto } from './dto/update-estados-envio.dto';

@Controller('estados-envio')
export class EstadosEnvioController {
  constructor(private readonly estadosEnvioService: EstadosEnvioService) {}

  @Post()
  create(@Body() createEstadosEnvioDto: CreateEstadosEnvioDto) {
    return this.estadosEnvioService.create(createEstadosEnvioDto);
  }

  @Get()
  findAll() {
    return this.estadosEnvioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosEnvioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstadosEnvioDto: UpdateEstadosEnvioDto) {
    return this.estadosEnvioService.update(+id, updateEstadosEnvioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadosEnvioService.remove(+id);
  }
}
