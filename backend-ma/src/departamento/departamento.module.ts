import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoController } from './departamento.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartamentoController],
  providers: [DepartamentoService],
})
export class DepartamentoModule {}
