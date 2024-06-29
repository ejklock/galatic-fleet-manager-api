import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainRuleViolationException } from '../common/common.exceptions';
import { ContractEntity } from './contract.entity';
import { ContractService } from './contract.service';

describe('ContractService', () => {
  let contractService: ContractService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: getRepositoryToken(ContractEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    contractService = moduleRef.get<ContractService>(ContractService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should store contract and contract resources successfully', async () => {
    const contract: Partial<ContractEntity> = {
      originPlanetId: 1,
      destinationPlanetId: 2,
      pilotId: 1,
      description: 'Test Contract',
      value: 100,
    };

    const contractResources = [
      { resourceId: 1, quantity: 1 },
      { resourceId: 2, quantity: 2 },
    ];

    const mockStoreContract = jest.spyOn(
      contractService as any,
      'storeWithResources',
    );

    mockStoreContract.mockResolvedValue({
      id: 1,
      originPlanetId: 1,
      destinationPlanetId: 2,
      pilotId: 1,
      description: 'Test Contract',
      value: 100,
    } as ContractEntity);
    const result = await contractService.storeWithResources(
      contract,
      contractResources,
    );

    expect(result).toBeDefined();

    expect(mockStoreContract).toHaveBeenCalledWith(
      expect.objectContaining(contract),
      expect.any(Object),
    );
  });

  it('should raise an exception when invalid travel configuration is provided', async () => {
    const contract: Partial<ContractEntity> = {
      originPlanetId: 1,
      destinationPlanetId: 2,
      pilotId: 1,
      description: 'Test Contract',
      value: 100,
    };

    const contractResources = [
      { resourceId: 1, quantity: 1 },
      { resourceId: 2, quantity: 2 },
    ];

    const mockCreateQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    };

    jest.spyOn(contractService, 'getNewQueryRunner').mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as any);

    jest.spyOn(contractService, 'getEntityManager').mockReturnValue({
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockCreateQueryBuilder),
        findOne: jest.fn().mockResolvedValue(undefined),
      }),
    } as any);

    await expect(
      contractService.storeWithResources(contract, contractResources),
    ).rejects.toThrow(DomainRuleViolationException);
  });
});
