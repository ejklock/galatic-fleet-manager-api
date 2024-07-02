import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const envPathToLoad = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenvConfig({ path: envPathToLoad });

export const mysqlConfig = {
  type: 'mysql',
  host: process.env.MYSQL_DATABASE_HOST,
  port: parseInt(process.env.MYSQL_DATABASE_PORT, 10) || 3306,
  logging: !!parseInt(process.env.MYSQL_DATABASE_LOGGING) || true,
  username: process.env.MYSQL_DATABASE_USER,
  password: process.env.MYSQL_DATABASE_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  seeds: [__dirname + '/../database/seeds/*{.ts,.js}'],
  entities: [__dirname + '/../**/*.entity{.ts}'],
  synchronize: !!process.env.MYSQL_DATABASE_SYNCHRONIZE || false,
};

export default registerAs('db-mysql', () => mysqlConfig);

export const connectionSource = new DataSource(
  mysqlConfig as DataSourceOptions,
);
