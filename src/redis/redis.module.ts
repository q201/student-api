/* eslint-disable prettier/prettier */
import { Module, Global } from '@nestjs/common';
import IORedis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redisClient = new IORedis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD,
        });
        return redisClient;
      }, 
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
