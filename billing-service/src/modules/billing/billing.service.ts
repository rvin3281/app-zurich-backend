import {
  BillingRecordModel,
  BillingRecordRepository,
  CustomerPortalRepository,
  ProductRecordRepository,
} from '@app-zurich-backend/database';
import {
  AdminLoginDto,
  AdminLogInInterface,
  CreateBillingDto,
  SampleCustomerData,
  SampleProductData,
  SuccessBaseResponse,
  SuccessBaseResponseWithData,
  successResponseBuilder,
} from '@app-zurich-backend/shared';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BillingService {
  //Initiate Logger
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private billingRecordRepository: BillingRecordRepository,
    private customerPortalRepository: CustomerPortalRepository,
    private productRecordRepository: ProductRecordRepository,
    private sequelize: Sequelize,
  ) {}

  async create(
    createBillingDto: CreateBillingDto,
  ): Promise<SuccessBaseResponseWithData<BillingRecordModel>> {
    try {
      // validate product code exist
      const existProduct = await this.productRecordRepository.findOne({
        where: { id: createBillingDto.productId },
      });

      // validate customer exist
      const existCustomer = await this.customerPortalRepository.findOne({
        where: { id: createBillingDto.customerId },
      });

      if (!existProduct) {
        throw new BadRequestException(`Product with ID ${createBillingDto.productId} not exist`);
      }

      if (!existCustomer) {
        throw new BadRequestException(`Product with ID ${createBillingDto.customerId} not exist`);
      }

      // validation passed ==> able to create billing record
      const createdBilling = await this.billingRecordRepository.create(createBillingDto);
      return successResponseBuilder<BillingRecordModel>(
        'Billing Created Successfully',
        createdBilling,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        error.message,
        error.stack,
        JSON.stringify({
          service: BillingService.name,
          additionalInfo: { createBillingDto },
        }),
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async adminLoginTest(adminLoginDto: AdminLoginDto): Promise<AdminLogInInterface> {
    const { email, password } = adminLoginDto;

    if (email !== 'admin@admin.com' || password !== 'abc123') {
      throw new UnauthorizedException('You are not authorized');
    }

    return {
      email: adminLoginDto.email,
      roles: 'admin',
    };
  }

  async createCustomerAndProduct(): Promise<SuccessBaseResponse> {
    const transaction = await this.sequelize.transaction();
    try {
      await this.billingRecordRepository.destroyTable({ where: {}, transaction });
      await this.customerPortalRepository.destroyTable({ where: {}, transaction });
      await this.productRecordRepository.destroyTable({ where: {}, transaction });

      const sampleUserData = SampleCustomerData;
      const sampleProductData = SampleProductData;

      await this.customerPortalRepository.bulkCreate(sampleUserData, {
        transaction,
      });
      await this.productRecordRepository.bulkCreate(sampleProductData, {
        transaction,
      });

      await transaction.commit();
      return {
        status: 'success',
        message: 'Sample Customer data created successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        error.message,
        error.stack,
        JSON.stringify({
          service: BillingService.name,
        }),
      );
      throw new InternalServerErrorException('An unexpected error occurs');
    }
  }
}
