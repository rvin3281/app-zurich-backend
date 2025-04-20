import { BillingRecordModel } from '@app-zurich-backend/database';
import {
  AdminLoginDto,
  AdminLogInInterface,
  CreateBillingDto,
  HttpExceptionFilter,
  Roles,
  SuccessBaseResponse,
  SuccessBaseResponseWithData,
  USER_ROLE,
} from '@app-zurich-backend/shared';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';

@ApiTags('Billing Service')
@ApiSecurity('X-API-ROLES')
@UseFilters(HttpExceptionFilter)
@Controller({
  path: 'billing',
  version: ['1'],
})
export class BillingController {
  // Initiate logger
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly billingService: BillingService) {}

  @Post('/')
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({
    summary: 'create billing',
    description: 'This endpoint allows to create a billing record',
  })
  @ApiBody({ type: CreateBillingDto })
  @ApiResponse({
    status: 201,
    description: 'Billing created successfully',
    type: BillingRecordModel,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(
    @Body() createBillingDto: CreateBillingDto,
  ): Promise<SuccessBaseResponseWithData<BillingRecordModel>> {
    try {
      return this.billingService.create(createBillingDto);
    } catch (error) {
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

  @Post('login')
  @ApiOperation({
    summary: 'Custom Admin Login',
    description: 'test data email:admin@admin.com password:abc123',
  })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto): Promise<AdminLogInInterface> {
    return await this.billingService.adminLoginTest(adminLoginDto);
  }

  @Post('/create-customer-and-product-data')
  @ApiOperation({
    summary: 'Create sample data',
    description: 'Creates sample customer and product records to test billing creation.',
  })
  async createCustomerAndProduct(): Promise<SuccessBaseResponse> {
    return await this.billingService.createCustomerAndProduct();
  }
}
