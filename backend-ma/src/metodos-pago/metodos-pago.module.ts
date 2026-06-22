import { Module } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { MetodosPagoController } from './metodos-pago.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [MetodosPagoController],
  providers: [MetodosPagoService],
})
export class MetodosPagoModule {}
