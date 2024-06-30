import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import dbMysqlConfig from './config/db-mysql.config';
import { MySqlDBConfigService } from './config/services/MySqlDBConfigService';
import storageConfig from './config/storage.config';

import { RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpModule } from './http/http.module';
import { StorageModule } from './storage/storage.module';
import { ReportModule } from './domains/report/report.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'api/v1',
        module: HttpModule,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/storage/'),
      serveRoot: '/storage/',
      serveStaticOptions: {
        index: false,
        maxAge: 31536000,
        extensions: ['jpg', 'jpeg', 'png', 'svg'],
      },
    }),
    ConfigModule.forRoot({
      load: [dbMysqlConfig, appConfig, storageConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: MySqlDBConfigService,
      inject: [MySqlDBConfigService],
    }),

    HttpModule,
    StorageModule,
    ReportModule,
  ],

  providers: [],
})
export class AppModule {}
