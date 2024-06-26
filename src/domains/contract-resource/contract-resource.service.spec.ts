import { Test, TestingModule } from '@nestjs/testing';
import { ContractResourceService } from './contract-resource.service';

describe('ContractResourceService', () => {
  let service: ContractResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractResourceService],
    }).compile();

    service = module.get<ContractResourceService>(ContractResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
