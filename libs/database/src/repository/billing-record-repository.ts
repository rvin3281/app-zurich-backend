import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DestroyOptions, FindOptions, Transaction, UpdateOptions } from 'sequelize';
import { BillingRecordModel } from '../entity/billingRecordModel';

@Injectable()
export class BillingRecordRepository {
  constructor(
    @InjectModel(BillingRecordModel) private billingRecordModel: typeof BillingRecordModel,
  ) {}

  async create(
    data: Partial<BillingRecordModel>,
    options?: { transaction?: Transaction },
  ): Promise<BillingRecordModel> {
    return await this.billingRecordModel.create(data as any, options);
  }

  async findOne(options?: FindOptions<BillingRecordModel>): Promise<BillingRecordModel | null> {
    return await this.billingRecordModel.findOne(options);
  }

  async findById(id: number): Promise<BillingRecordModel | null> {
    return await this.billingRecordModel.findByPk(id);
  }

  async findAll(options?: FindOptions<BillingRecordModel>): Promise<BillingRecordModel[] | null> {
    return await this.billingRecordModel.findAll(options);
  }

  async findAndCountAll(
    options?: FindOptions<BillingRecordModel>,
  ): Promise<{ rows: BillingRecordModel[]; count: number }> {
    return await this.billingRecordModel.findAndCountAll(options);
  }

  async update(
    data: Partial<BillingRecordModel>,
    options: UpdateOptions,
  ): Promise<[afffectedCount: number]> {
    return await this.billingRecordModel.update(data, options);
  }

  async destroyTable(options: DestroyOptions) {
    return await this.billingRecordModel.destroy(options);
  }
}
