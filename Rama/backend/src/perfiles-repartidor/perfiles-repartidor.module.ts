import { Module } from '@nestjs/common';
import { PerfilesRepartidorController } from './perfiles-repartidor.controller';
import { PerfilesRepartidorService } from './perfiles-repartidor.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PerfilesRepartidorController],
  providers: [PerfilesRepartidorService],
})
export class PerfilesRepartidorModule {}