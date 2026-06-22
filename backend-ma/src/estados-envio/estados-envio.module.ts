import { Module } from '@nestjs/common';
import { EstadosEnvioService } from './estados-envio.service';
import { EstadosEnvioController } from './estados-envio.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [EstadosEnvioController],
  providers: [EstadosEnvioService],
})
export class EstadosEnvioModule {}
