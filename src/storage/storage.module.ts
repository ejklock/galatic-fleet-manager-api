import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import storageConfig from '../config/storage.config';
import { LocalStorageService } from './local-storage.service';
import StorageService from './storage.service';

const providers = [
  {
    provide: StorageService,
    inject: [storageConfig.KEY],
    useFactory: async (_storageConfig: ConfigType<typeof storageConfig>) => {
      return new LocalStorageService(_storageConfig);
    },
  },
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class StorageModule {}
