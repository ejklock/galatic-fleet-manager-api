import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { DomainRuleViolationException } from '../common/common.exceptions';
import {
  createDataSourceMock,
  createTypeOrmMocks,
} from '../common/utils/tests/type-orm.utils';
import { ContractResourceEntity } from '../contract-resource/contract-resource.entity';
import { ResourceEntity } from '../resource/resource.entity';
import { TravelConfigEntity } from '../travel-config/travel-config.entity';
import { ContractEntity } from './contract.entity';
import { ContractService } from './contract.service';
import { ContractResource, ContractStatusEnum } from './contract.types';

describe('ContractService', () => {
  let service: ContractService;
  let contractRepository: Repository<ContractEntity>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        createTypeOrmMocks(ContractEntity),
        createDataSourceMock(),
      ],
    }).compile();

    service = module.get<ContractService>(ContractService);
    contractRepository = module.get<Repository<ContractEntity>>(
      getRepositoryToken(ContractEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('storeValidatingTravelConfigsAndResources', () => {
    it('should store contract and contract resources successfully', async () => {
      const mockContract = {
        originPlanetId: 1,
        destinationPlanetId: 2,
      } as DeepPartial<ContractEntity>;
      const mockContractResources = [
        { resourceId: 1, quantity: 10 },
      ] as ContractResource[];

      dataSource.manager.getRepository(TravelConfigEntity).findOne = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          fromPlanetId: 1,
          toPlanetId: 2,
          fuelConsumption: 10,
        } as TravelConfigEntity);

      dataSource
        .createQueryRunner()
        .manager.getRepository(ResourceEntity)
        .createQueryBuilder().getMany = jest
        .fn()
        .mockResolvedValue([{ id: 1 }]);
      dataSource
        .createQueryRunner()
        .manager.getRepository(ContractEntity).save = jest
        .fn()
        .mockResolvedValue({ id: 1 });
      dataSource
        .createQueryRunner()
        .manager.getRepository(ContractResourceEntity).insert = jest
        .fn()
        .mockResolvedValue({});

      dataSource.createQueryRunner().startTransaction = jest.fn();
      dataSource.createQueryRunner().commitTransaction = jest.fn();
      dataSource.createQueryRunner().rollbackTransaction = jest.fn();

      const result = await service.storeValidatingTravelConfigsAndResources(
        mockContract,
        mockContractResources,
      );

      expect(result).toBeDefined();
      expect(
        dataSource.createQueryRunner().startTransaction,
      ).toHaveBeenCalled();
      expect(
        dataSource.createQueryRunner().commitTransaction,
      ).toHaveBeenCalled();
      expect(
        dataSource.createQueryRunner().rollbackTransaction,
      ).not.toHaveBeenCalled();
    });

    it('should throws error on try to create a contract with invalid resources', async () => {
      const mockContract = {
        originPlanetId: 1,
        destinationPlanetId: 2,
      } as DeepPartial<ContractEntity>;
      const mockContractResources = [
        { resourceId: 1, quantity: 10 },
      ] as ContractResource[];

      dataSource.manager.getRepository(TravelConfigEntity).findOne = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          fromPlanetId: 1,
          toPlanetId: 2,
          fuelConsumption: 10,
        } as TravelConfigEntity);

      dataSource
        .createQueryRunner()
        .manager.getRepository(ResourceEntity)
        .createQueryBuilder().getMany = jest.fn().mockResolvedValue([]);

      await expect(
        service.storeValidatingTravelConfigsAndResources(
          mockContract,
          mockContractResources,
        ),
      ).rejects.toThrow(Error);
      expect(
        dataSource.createQueryRunner().startTransaction,
      ).toHaveBeenCalled();
      expect(
        dataSource.createQueryRunner().commitTransaction,
      ).not.toHaveBeenCalled();
      expect(
        dataSource.createQueryRunner().rollbackTransaction,
      ).toHaveBeenCalled();
    });

    it('should throws DomainRuleViolationException on try to create a contract with invalid travel config', async () => {
      const mockContract = {
        originPlanetId: 1,
        destinationPlanetId: 2,
      } as DeepPartial<ContractEntity>;
      const mockContractResources = [
        { resourceId: 1, quantity: 10 },
      ] as ContractResource[];

      dataSource.manager.getRepository(TravelConfigEntity).findOne = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        service.storeValidatingTravelConfigsAndResources(
          mockContract,
          mockContractResources,
        ),
      ).rejects.toThrow(DomainRuleViolationException);

      expect(
        dataSource.createQueryRunner().startTransaction,
      ).toHaveBeenCalled();
      expect(
        dataSource.createQueryRunner().commitTransaction,
      ).not.toHaveBeenCalled();
      expect(
        dataSource.createQueryRunner().rollbackTransaction,
      ).toHaveBeenCalled();
    });
  });

  describe('acceptContract', () => {
    it('should accept contract successfully', async () => {
      const mockContract = {
        id: 1,
      } as DeepPartial<ContractEntity>;
      service.findOne = jest.fn().mockResolvedValue(mockContract);

      contractRepository.save = jest.fn().mockResolvedValue({
        status: ContractStatusEnum.ACCEPTED,
      });

      const result = await service.acceptContract(mockContract.id);

      expect(result).toBeDefined();
      expect(contractRepository.save).toHaveBeenCalled();

      expect(result.status).toBe(ContractStatusEnum.ACCEPTED);
    });
  });
});
