import {
  BillingRecordModel,
  BillingRecordRepository,
  CustomerPortalRepository,
  CustomersBillingPortalModel,
  ProductRecordModel,
  ProductRecordRepository,
} from '@app-zurich-backend/database';
import { CreateBillingDto } from '@app-zurich-backend/shared';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  let service: BillingService;
  let billingRecordRepository: jest.Mocked<BillingRecordRepository>;
  let productRecordRepository: jest.Mocked<ProductRecordRepository>;
  let customerPortalRepository: jest.Mocked<CustomerPortalRepository>;

  const createBillingDto: CreateBillingDto = {
    productId: 2,
    customerId: 3,
    premiumPaid: 100,
  };

  const mockProductData = {
    id: 1,
    location: 'East Malaysia',
    productCode: '4000',
  } as unknown as ProductRecordModel;

  const mockCustomerData = {
    id: 2,
    firstName: 'test user',
    lastName: 'test user last name',
    email: 'arvend@100@gmail.com',
    photo: 'http://localhost:3000/photo',
  } as unknown as CustomersBillingPortalModel;

  const mockBillingRecord = {
    id: 10,
    premiumPaid: 100,
  } as unknown as BillingRecordModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: BillingRecordRepository, useValue: { create: jest.fn() } },
        { provide: ProductRecordRepository, useValue: { findOne: jest.fn() } },
        { provide: CustomerPortalRepository, useValue: { findOne: jest.fn() } },
        { provide: Sequelize, useValue: {} },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    billingRecordRepository = module.get(BillingRecordRepository);
    productRecordRepository = module.get(ProductRecordRepository);
    customerPortalRepository = module.get(CustomerPortalRepository);
  });

  // UNIT TESTING FOR CREATE
  describe('create()', () => {
    it('create billing record if customer and product exist', async () => {
      productRecordRepository.findOne.mockResolvedValue(mockProductData);
      customerPortalRepository.findOne.mockResolvedValue(mockCustomerData);

      billingRecordRepository.create.mockResolvedValue(mockBillingRecord); // Set mock return

      const result = await service.create(createBillingDto);

      expect(billingRecordRepository.create).toHaveBeenCalledWith(createBillingDto); // ✅ Correct
      expect(result.data).toEqual(mockBillingRecord);
      expect(result.message).toEqual('Billing Created Successfully');

      expect(productRecordRepository.findOne).toHaveBeenCalledWith({
        where: { id: createBillingDto.productId },
      });
      expect(customerPortalRepository.findOne).toHaveBeenCalledWith({
        where: { id: createBillingDto.customerId },
      });
    });
  });

  // Unit test for findALl
  describe('findAll()', () => {
    it('should return paginate billing records using default page and size', async () => {
      const mockRows = [
        { id: 1, premiumPaid: 100 },
        { id: 2, premiumPaid: 200 },
      ];

      billingRecordRepository.findAndCountAll = jest
        .fn()
        .mockResolvedValue({ count: 10, rows: mockRows });

      const result = await service.findAll();

      expect(billingRecordRepository.findAndCountAll).toHaveBeenCalledWith({
        raw: true,
        offset: 0,
        limit: 5,
        include: [
          {
            model: ProductRecordModel,
            required: true,
            where: undefined,
          },
        ],
      });

      expect(result.message).toBe('billing data fetched successfully');
      expect(result.data).toEqual(mockRows);
      expect(result.status).toEqual('success');
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(2);
      expect(result.meta.totalRecords).toBe(10);
    });
  });
});
