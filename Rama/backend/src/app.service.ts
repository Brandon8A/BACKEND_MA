import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}

  async getHello() {
    const result = await this.db.query(
      'SELECT COUNT(*) FROM usuarios',
    );

    return result.rows;
  }
}