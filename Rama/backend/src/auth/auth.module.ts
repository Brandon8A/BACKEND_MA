import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'FlashDelivery2026',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
              JwtStrategy,
  ],
})
export class AuthModule {}