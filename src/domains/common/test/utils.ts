import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ContractResourceEntity } from '../../contract-resource/contract-resource.entity';
import { ContractEntity } from '../../contract/contract.entity';
import { PilotCreditTransactionEntity } from '../../pilot-credit-transaction/pilot-credit-transaction.entity';
import { PilotShipEntity } from '../../pilot-ship/pilot-ship.entity';
import { PilotEntity } from '../../pilot/pilot.entity';
import { ResourceEntity } from '../../resource/resource.entity';
import { ShipFuelTransactionEntity } from '../../ship-fuel-transaction/ship-fuel-transaction.entity';
import { ShipEntity } from '../../ship/ship.entity';
import { TravelConfigEntity } from '../../travel-config/travel-config.entity';

export const mockRepositoryProviders = [
  {
    provide: getRepositoryToken(ContractEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(ContractResourceEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(TravelConfigEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(PilotEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(ResourceEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(PilotShipEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(ShipEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(ShipFuelTransactionEntity),
    useClass: Repository,
  },
  {
    provide: getRepositoryToken(PilotCreditTransactionEntity),
    useClass: Repository,
  },
  {
    provide: DataSource, // Mock the DataSource dependency
    useValue: {}, // You can use an empty object or a more detailed mock if needed
  },
];
