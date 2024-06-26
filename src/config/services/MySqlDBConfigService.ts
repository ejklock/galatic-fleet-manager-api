import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import dbMysqlConfig from '../db-mysql.config';

@Injectable()
export class MySqlDBConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(dbMysqlConfig.KEY)
    private config: ConfigType<typeof dbMysqlConfig>,
  ) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      database: this.config.database,
      host: this.config.host,
      autoLoadEntities: true,
      entities: this.config.entities,
      migrations: this.config.migrations,
      port: this.config.port,
      verboseRetryLog: true,
      logging: this.config.logging,
      username: this.config.username,
      password: this.config.password,
      synchronize: this.config.synchronize,
    };
  }
}
