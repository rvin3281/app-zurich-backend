import {
  BillingRecordModel,
  BillingRecordRepository,
  CustomerPortalRepository,
  ProductRecordModel,
  ProductRecordRepository,
} from '@app-zurich-backend/database';
import {
  AdminLoginDto,
  AdminLogInInterface,
  CreateBillingDto,
  customerNameInterface,
  GetAllBillingDto,
  productCodeInterface,
  SampleCustomerData,
  SampleProductData,
  SuccessBaseResponse,
  SuccessBaseResponseWithData,
  SuccessPaginatedBaseResponse,
  successResponseBuilder,
  successResponsePaginatedBuilder,
  UpdateBillingDto,
} from '@app-zurich-backend/shared';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindAndCountOptions, FindOptions, UpdateOptions } from 'sequelize';
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

  async findAll(
    query?: GetAllBillingDto,
  ): Promise<SuccessPaginatedBaseResponse<BillingRecordModel>> {
    try {
      //Default page 1
      const page = query?.page && query.page ? query.page : 1;
      // Default size 5
      const size = query?.size && query.size ? query.size : 5;

      const offset = Number(page - 1) * Number(size);

      const { productCode, location } = query || {};

      const productWhere: any = {};
      if (productCode) productWhere.productCode = productCode;
      if (location) productWhere.location = location;

      const options: FindAndCountOptions = {
        raw: true,
        offset,
        limit: Number(size),
        include: [
          {
            model: ProductRecordModel,
            required: true,
            where: Object.keys(productWhere).length > 0 ? productWhere : undefined,
          },
          'customer',
        ],
      };

      const data = await this.billingRecordRepository.findAndCountAll(options);

      return successResponsePaginatedBuilder<BillingRecordModel>(
        'billing data fetched successfully',
        data.count,
        Math.ceil(data.count / Number(size)),
        Number(page),
        data.rows,
      );
    } catch (error) {
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

  async findById(id: number): Promise<SuccessBaseResponseWithData<BillingRecordModel>> {
    try {
      const data = await this.billingRecordRepository.findOne({
        where: { id },
        include: ['customer', 'product'],
      });

      if (!data || data === null) {
        throw new NotFoundException(`Billing record with id ${id} not found`);
      }

      return successResponseBuilder<BillingRecordModel>(`Product with ${id} found`, data);
    } catch (error) {
      if (error instanceof HttpException) throw error;
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

  async update(id: number, requestBillingData: UpdateBillingDto): Promise<SuccessBaseResponse> {
    try {
      const data = await this.billingRecordRepository.findById(id);

      if (!data || data === null) {
        throw new NotFoundException(`Billing record with id ${id} not found`);
      }

      if (requestBillingData.customerId) {
        const customer = await this.customerPortalRepository.findById(
          requestBillingData.customerId,
        );
        if (!customer)
          throw new NotFoundException(
            `Customer with ID ${requestBillingData.customerId} not found`,
          );
      }

      if (requestBillingData.productId) {
        const product = await this.productRecordRepository.findById(requestBillingData.productId);
        if (!product)
          throw new NotFoundException(`Product with ID ${requestBillingData.productId} not found`);
      }

      const updatedData: Partial<BillingRecordModel> = {};
      if (requestBillingData.customerId) updatedData.customerId = requestBillingData.customerId;
      if (requestBillingData.productId) updatedData.productId = requestBillingData.productId;
      if (requestBillingData.premiumPaid) updatedData.premiumPaid = requestBillingData.premiumPaid;

      const [affectedCount] = await this.billingRecordRepository.update(updatedData, {
        where: { id },
      });

      if (affectedCount === 0) {
        throw new InternalServerErrorException('Failed to update billing record');
      }

      return successResponseBuilder<BillingRecordModel>(
        `Billing record with ID ${id} updated successfully`,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
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

  async delete(id: number): Promise<SuccessBaseResponse> {
    try {
      const data = await this.billingRecordRepository.findById(id);

      if (!data || data === null) {
        throw new NotFoundException(`Billing record with id ${id} not found`);
      }

      const option: UpdateOptions<BillingRecordModel> = {
        where: {
          id,
        },
      };

      const updatedData = {
        deletedAt: new Date(),
        deletedByUserId: 1, // Sample user id
      };

      const [affectedCount] = await this.billingRecordRepository.update(updatedData, option);

      if (affectedCount === 0) {
        throw new BadRequestException(`Billing record with ID ${id} unable to delete`);
      }

      return successResponseBuilder<BillingRecordModel>(
        `Billing record with ID ${id} updated successfully`,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
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

  // istanbul ignore next
  async adminLoginTest(adminLoginDto: AdminLoginDto): Promise<AdminLogInInterface> {
    const { email, password } = adminLoginDto;

    if (email !== 'admin@admin.com' || password !== 'abc123') {
      throw new UnauthorizedException('You are not authorized');
    }

    return {
      id: 1,
      name: 'admin',
      email,
      role: 'admin',
    };
  }

  // istanbul ignore next
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

  async getCustomerNames(): Promise<SuccessBaseResponseWithData<customerNameInterface[]>> {
    try {
      const options: FindOptions = {
        where: {},
        attributes: ['id', 'firstName', 'lastName'],
        raw: true,
      };
      const customerData = await this.customerPortalRepository.findAll(options);

      if (!customerData || customerData.length === 0) {
        throw new NotFoundException('No customer data');
      }

      const newData = customerData.map(customer => ({
        id: Number(customer.id),
        name: `${customer.firstName} ${customer.lastName}`,
      }));

      return successResponseBuilder('customer name retrieved successfully', newData);
    } catch (error) {
      if (error instanceof HttpException) throw error;
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

  async getProductNames(): Promise<SuccessBaseResponseWithData<productCodeInterface[]>> {
    try {
      const options: FindOptions = {
        where: {},
        attributes: ['id', 'productCode', 'location'],
        raw: true,
      };
      const productData = await this.productRecordRepository.findAll(options);
      if (!productData || productData.length === 0) {
        throw new NotFoundException('No customer data');
      }

      const newData = productData.map(product => ({
        id: Number(product.id),
        product: `${product.productCode}-${product.location}`,
      }));

      return successResponseBuilder('customer name retrieved successfully', newData);
    } catch (error) {
      if (error instanceof HttpException) throw error;
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
