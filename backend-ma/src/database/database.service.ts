import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';

import {
  Pool,
  PoolClient,
} from 'pg';

@Injectable()
export class DatabaseService
  implements OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async query(
    text: string,
    params?: any[],
  ) {
    return this.pool.query(text, params);
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}