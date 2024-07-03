/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
//import { jwtConstants } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { RedisModule }  from '../redis/redis.module'


@Module({
  
  imports: [
    TypeOrmModule.forFeature([User]), // Import and provide the repository
    UsersModule,
    RedisModule,
    JwtModule.registerAsync({
      global:true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '120s' },
  }),
}),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})

export class AuthModule {
  
}
