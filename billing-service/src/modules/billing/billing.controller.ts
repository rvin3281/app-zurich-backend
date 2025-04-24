import { BillingRecordModel } from '@app-zurich-backend/database';
import {
  AdminLoginDto,
  AdminLogInInterface,
  CreateBillingDto,
  customerNameInterface,
  GetAllBillingDto,
  HttpExceptionFilter,
  productCodeInterface,
  Roles,
  SuccessBaseResponse,
  SuccessBaseResponseWithData,
  SuccessPaginatedBaseResponse,
  UpdateBillingDto,
  USER_ROLE,
} from '@app-zurich-backend/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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
    return this.billingService.create(createBillingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'get all billing records',
    description: 'Returns paginated billing records',
  })
  @ApiResponse({ status: 200, description: 'Billing records fetched successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Page size' })
  @ApiQuery({
    name: 'productCode',
    required: false,
    type: String,
    description: 'Filter by product code',
  })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Filter by location' })
  async findAll(
    @Query() query?: GetAllBillingDto,
  ): Promise<SuccessPaginatedBaseResponse<BillingRecordModel>> {
    return await this.billingService.findAll(query);
  }

  @Delete('/:id')
  @Roles(USER_ROLE.ADMIN)
  @ApiResponse({ status: 200, description: 'Billing record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Billing record not found' })
  async deleteById(@Param('id') id: number): Promise<SuccessBaseResponse> {
    return this.billingService.delete(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update Billing Record by ID' })
  @ApiBody({ type: UpdateBillingDto })
  @ApiResponse({ status: 200, description: 'Billing record updated successfully' })
  @ApiResponse({
    status: 404,
    description: 'Billing record or customer id or prooduct ID not found',
  })
  async update(
    @Param('id') id: number,
    @Body() updateBillingDto: UpdateBillingDto,
  ): Promise<SuccessBaseResponse> {
    return this.billingService.update(id, updateBillingDto);
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

  @Post('create-customer-and-product-data')
  @ApiOperation({
    summary: 'Create sample data',
    description: 'Creates sample customer and product records to test billing creation.',
  })
  async createCustomerAndProduct(): Promise<SuccessBaseResponse> {
    return await this.billingService.createCustomerAndProduct();
  }

  @Get('get-customers')
  @ApiOperation({
    summary: 'Get customer names',
    description: 'fetch a list of available customer names and IDs for billing selection.',
  })
  async getCustomerNames(): Promise<SuccessBaseResponseWithData<customerNameInterface[]>> {
    return await this.billingService.getCustomerNames();
  }

  @Get('get-products')
  @ApiOperation({
    summary: 'Get product names',
    description: 'fetch a list of available product codes and details for billing selection.',
  })
  async getProductNames(): Promise<SuccessBaseResponseWithData<productCodeInterface[]>> {
    return await this.billingService.getProductNames();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Billing Record by ID' })
  @ApiResponse({ status: 200, description: 'Billing record found', type: BillingRecordModel })
  @ApiResponse({ status: 404, description: 'Billing record not found' })
  async findById(
    @Param('id') id: number,
  ): Promise<SuccessBaseResponseWithData<BillingRecordModel>> {
    return await this.billingService.findById(id);
  }
}
