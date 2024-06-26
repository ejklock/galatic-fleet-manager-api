import { Test, TestingModule } from '@nestjs/testing';
import { ShipService } from 'src/domains/ship/ship.service';
import { ShipController } from './ship.controller';

describe('ShipController', () => {
  let controller: ShipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipController],
      providers: [ShipService],
    }).compile();

    controller = module.get<ShipController>(ShipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
