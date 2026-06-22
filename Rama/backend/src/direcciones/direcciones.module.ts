import { Module } from '@nestjs/common';
import { DireccionesService } from './direcciones.service';
import { DireccionesController } from './direcciones.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DireccionesService],
  controllers: [DireccionesController]
})
export class DireccionesModule {}
