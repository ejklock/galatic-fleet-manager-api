import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import storageConfig from '../config/storage.config';
import { LocalStorageService } from './local-storage.service';
import { StorageModule } from './storage.module';
import StorageService from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  const setEnvVariables = (config: { [key: string]: string }) => {
    for (const [key, value] of Object.entries(config)) {
      process.env[key] = value;
    }
  };

  beforeEach(async () => {
    setEnvVariables({
      STORAGE_DEFAULT: 'local',
      STORAGE_LOCAL_DIRECTORY: './storage',
      STORAGE_LOCAL_URL: 'http://localhost',
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [storageConfig],
          isGlobal: true,
        }),
        StorageModule,
      ],
      providers: [LocalStorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should url return a path with url configured', () => {
    const url = service.url('test.png');
    expect(url).toEqual('http://localhost/storage/test.png');
  });

  it('should return relative path with url configured', () => {
    const path = service.relativePath('test.png');
    expect(path).toEqual('storage/test.png');
  });
});
