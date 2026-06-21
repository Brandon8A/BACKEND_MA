import { Module } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CalificacionController } from './calificacion.controller';

@Module({
  providers: [CalificacionService],
  controllers: [CalificacionController]
})
export class CalificacionModule {}
