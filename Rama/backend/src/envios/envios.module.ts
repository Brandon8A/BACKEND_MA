import { Module } from '@nestjs/common';
import { EnviosController } from './envios.controller';
import { EnviosService } from './envios.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [EnviosController],
  providers: [EnviosService, DatabaseService],
})
export class EnviosModule {}