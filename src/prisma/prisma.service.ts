import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as path from 'path';
import * as dotenv from 'dotenv';
 
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
 
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaMariaDb(String(process.env.DATABASE_URL));
    super({
      adapter: adapter,
    });
  }
 
  async onModuleInit() {
    await this.$connect();
  }
 
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
 