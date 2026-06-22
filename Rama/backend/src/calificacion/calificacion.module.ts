import { Module } from '@nestjs/common';
import { CalificacionesService } from './calificacion.service';
import { CalificacionesController } from './calificacion.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CalificacionesService],
  controllers: [CalificacionesController]
})
export class CalificacionModule {}
