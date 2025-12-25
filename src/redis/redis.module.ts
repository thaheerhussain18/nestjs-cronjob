import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST ,
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
