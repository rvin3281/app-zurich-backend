import {
  BillingRecordRepository,
  CustomerPortalRepository,
  ProductRecordRepository,
} from '@app-zurich-backend/database';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

describe('BillingController', () => {
  let controller: BillingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        BillingService,
        { provide: BillingRecordRepository, useValue: {} },
        { provide: CustomerPortalRepository, useValue: {} },
        { provide: ProductRecordRepository, useValue: {} },
        { provide: Sequelize, useValue: {} },
      ],
    }).compile();

    controller = module.get<BillingController>(BillingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
