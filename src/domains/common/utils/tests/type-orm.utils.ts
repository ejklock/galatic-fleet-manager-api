import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

export function createTypeOrmMocks(entity: any) {
  return {
    provide: getRepositoryToken(entity),
    useClass: Repository,
  };
}

export function createDataSourceMock() {
  return {
    provide: DataSource,
    useValue: {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn(),
            save: jest.fn(),
            insert: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              getMany: jest.fn().mockResolvedValue([]),
              where: jest.fn().mockReturnThis(),
            }),
          }),
        },
      }),
      manager: {
        getRepository: jest.fn().mockReturnValue({
          findOne: jest.fn(),
          save: jest.fn(),
          insert: jest.fn(),
          createQueryBuilder: jest.fn().mockReturnValue({
            getMany: jest.fn().mockResolvedValue([]),
          }),
        }),
      },
      destroy: jest.fn(),
    },
  };
}
