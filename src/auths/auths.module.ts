import { Module } from '@nestjs/common';
import { AuthController } from './auths.controller';
import { AuthsService } from './auths.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
      global: true,
    }),
    UsersModule,
  ],
  providers: [AuthsService],
  controllers: [AuthController],
})
export class AuthsModule {}
