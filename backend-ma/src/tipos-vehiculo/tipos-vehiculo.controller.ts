import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TiposVehiculoService } from './tipos-vehiculo.service';
import { CreateTiposVehiculoDto } from './dto/create-tipos-vehiculo.dto';
import { UpdateTiposVehiculoDto } from './dto/update-tipos-vehiculo.dto';

@Controller('tipos-vehiculo')
export class TiposVehiculoController {
  constructor(private readonly tiposVehiculoService: TiposVehiculoService) {}

  @Post()
  create(@Body() createTiposVehiculoDto: CreateTiposVehiculoDto) {
    return this.tiposVehiculoService.create(createTiposVehiculoDto);
  }

  @Get()
  findAll() {
    return this.tiposVehiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposVehiculoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiposVehiculoDto: UpdateTiposVehiculoDto) {
    return this.tiposVehiculoService.update(+id, updateTiposVehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposVehiculoService.remove(+id);
  }
}
