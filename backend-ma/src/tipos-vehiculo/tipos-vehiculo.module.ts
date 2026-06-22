import { Module } from '@nestjs/common';
import { TiposVehiculoService } from './tipos-vehiculo.service';
import { TiposVehiculoController } from './tipos-vehiculo.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [TiposVehiculoController],
  providers: [TiposVehiculoService],
})
export class TiposVehiculoModule {}
