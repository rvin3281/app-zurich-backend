import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BulkCreateOptions, DestroyOptions, FindOptions, Transaction } from 'sequelize';
import { CustomersBillingPortalModel } from '../entity';

@Injectable()
export class CustomerPortalRepository {
  constructor(
    @InjectModel(CustomersBillingPortalModel)
    private customerBillingPortalModel: typeof CustomersBillingPortalModel,
  ) {}

  async destroyTable(options: DestroyOptions) {
    return await this.customerBillingPortalModel.destroy(options);
  }
  async create(
    data: Partial<CustomersBillingPortalModel>,
    options?: { transaction?: Transaction },
  ) {
    return await this.customerBillingPortalModel.create(data as any);
  }

  async bulkCreate(data: Partial<CustomersBillingPortalModel>[], options: BulkCreateOptions) {
    return await this.customerBillingPortalModel.bulkCreate(data as any, options);
  }

  async findAll(
    options?: FindOptions<CustomersBillingPortalModel>,
  ): Promise<CustomersBillingPortalModel[] | null> {
    return await this.customerBillingPortalModel.findAll(options);
  }

  async findById(id: number): Promise<CustomersBillingPortalModel | null> {
    return await this.customerBillingPortalModel.findByPk(id);
  }

  async findOne(
    option?: FindOptions<CustomersBillingPortalModel>,
  ): Promise<CustomersBillingPortalModel | null> {
    return await this.customerBillingPortalModel.findOne(option);
  }
}
