import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerfilesRepartidorModule } from './perfiles-repartidor/perfiles-repartidor.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { EnviosModule } from './envios/envios.module';
import { CalificacionModule } from './calificacion/calificacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    PerfilesRepartidorModule,
    DireccionesModule,
    EnviosModule,
    CalificacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}