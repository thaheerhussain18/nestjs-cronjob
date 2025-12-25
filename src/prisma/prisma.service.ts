// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// import * as path from 'path';
// import * as dotenv from 'dotenv';
 
// dotenv.config({ path: path.resolve(process.cwd(), '.env') });
 
// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
//   constructor() {
//     const adapter = new PrismaMariaDb(String(process.env.DATABASE_URL));
//     super({
//       adapter: adapter,
//     });
//   }
 
//   async onModuleInit() {
//     await this.$connect();
//   }
 
//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
// }
 

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// Corrected import: 'PrismaMariaDb' (capital D)
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as path from 'path';
import * as dotenv from 'dotenv';
 
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
 
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Get the DB URL from the environment variables
    const databaseUrl = process.env.DATABASE_URL;
 
    // Ensure databaseUrl is defined before proceeding in a real application
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set in environment variables.');
    }
    const adapter = new PrismaMariaDb(databaseUrl);
 
    // 3. Pass the adapter to the PrismaClient constructor
    super({
      adapter: adapter,
      // You can still add other options here like logging: ['query']
    });
  }
 
  async onModuleInit() {
    await this.$connect();
  }
 
  async onModuleDestroy() {
    await this.$disconnect();
  }
}