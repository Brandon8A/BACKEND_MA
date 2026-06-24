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
import { DepartamentoModule } from './departamento/departamento.module';
import { MunicipioModule } from './municipio/municipio.module';
import { ZonaModule } from './zona/zona.module';
import { RolModule } from './rol/rol.module';
import { TiposVehiculoModule } from './tipos-vehiculo/tipos-vehiculo.module';
import { EstadosEnvioModule } from './estados-envio/estados-envio.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //DatabaseModule,
    AuthModule,
    UsuariosModule,
    PerfilesRepartidorModule,
    DireccionesModule,
    EnviosModule,
    CalificacionModule,
    DepartamentoModule,
    MunicipioModule,
    ZonaModule,
    RolModule,
    TiposVehiculoModule,
    EstadosEnvioModule,
    MetodosPagoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
