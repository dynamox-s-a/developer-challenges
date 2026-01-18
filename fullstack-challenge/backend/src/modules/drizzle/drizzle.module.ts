import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';
import { LibSQLDatabase } from 'drizzle-orm/libsql';

export const DRIZZLE = Symbol('Drizzle');
export type DrizzleConnection = LibSQLDatabase<typeof schema>;

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseFile = configService.get<string>('DB_FILE_NAME') || '';
        const params = { schema };
        return drizzle(databaseFile, params) as LibSQLDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
