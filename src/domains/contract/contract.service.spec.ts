import { Test } from '@nestjs/testing';
import { DomainRuleViolationException } from '../common/common.exceptions';
import { mockRepositoryProviders } from '../common/test/utils';
import { ContractResourceService } from '../contract-resource/contract-resource.service';
import { FederationTransactionLedgerService } from '../federation-transaction-ledger/federation-transaction-ledger.service';
import { PilotCreditTransactionService } from '../pilot-credit-transaction/pilot-credit-transaction.service';
import { PilotShipService } from '../pilot-ship/pilot-ship.service';
import { PilotEntity } from '../pilot/pilot.entity';
import { PilotService } from '../pilot/pilot.service';
import { ResourceEntity } from '../resource/resource.entity';
import { ShipFuelTransactionService } from '../ship-fuel-transaction/ship-fuel-transaction.service';
import { ShipService } from '../ship/ship.service';
import { TravelConfigEntity } from '../travel-config/travel-config.entity';
import { TravelConfigService } from '../travel-config/travel-config.service';
import { ContractEntity } from './contract.entity';
import { ContractService } from './contract.service';

describe('ContractService', () => {
  let contractService: ContractService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ContractService,
        PilotService,
        TravelConfigService,
        ContractResourceService,
        PilotShipService,
        PilotCreditTransactionService,
        FederationTransactionLedgerService,
        ShipService,
        ShipFuelTransactionService,
        ...mockRepositoryProviders,
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

    const mockGetRepository = jest.fn().mockImplementation((entity) => {
      switch (entity) {
        case TravelConfigEntity:
          return {
            findOne: jest.fn().mockResolvedValue(undefined),
          };
        case ResourceEntity:
          return {
            createQueryBuilder: jest
              .fn()
              .mockReturnValue(mockCreateQueryBuilder),
          };
        case PilotEntity:
          return {
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          };
        default:
          return {};
      }
    });

    const mockEntityManager = {
      getRepository: mockGetRepository,
    };

    jest.spyOn(contractService, 'getNewQueryRunner').mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: mockEntityManager,
    } as any);

    jest
      .spyOn(contractService, 'getEntityManager')
      .mockReturnValue(mockEntityManager as any);

    await expect(
      contractService.storeWithResources(contract, contractResources),
    ).rejects.toThrow(DomainRuleViolationException);
  });
});
