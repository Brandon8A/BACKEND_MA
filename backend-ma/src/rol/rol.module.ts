import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RolController],
  providers: [RolService],
})
export class RolModule {}
