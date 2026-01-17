import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleService {
  private db: any

  constructor() {
    this.db = drizzle(process.env.DB_FILE_NAME!);
  }

  async selectAll(table: any): Promise<boolean> {
    await this.db.select(table);
    return true;
  }

  async insert(table: any, entries: any[]): Promise<boolean> {
    await this.db.insert(table).values(entries);
    return true;
  }

  async update(id:string, table: any, entries: any): Promise<boolean> {
    await this.db.insert(table).values(entries);
    return true;
  }

  async delete(id:string, table: any): Promise<boolean> {
    return false;
  }
}
