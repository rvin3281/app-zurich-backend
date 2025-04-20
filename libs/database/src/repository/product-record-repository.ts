import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DestroyOptions, FindOptions, Transaction } from 'sequelize';
import { ProductRecordModel } from '../entity';

@Injectable()
export class ProductRecordRepository {
  constructor(
    @InjectModel(ProductRecordModel)
    private productRecordModel: typeof ProductRecordModel,
  ) {}

  async destroyTable(options: DestroyOptions) {
    return await this.productRecordModel.destroy(options);
  }

  async bulkCreate(data: Partial<ProductRecordModel>[], options?: { transaction?: Transaction }) {
    return await this.productRecordModel.bulkCreate(data as any, options);
  }

  async findAll(options?: FindOptions<ProductRecordModel>): Promise<ProductRecordModel[] | null> {
    return await this.productRecordModel.findAll(options);
  }

  async findOne(option?: FindOptions<ProductRecordModel>): Promise<ProductRecordModel | null> {
    return await this.productRecordModel.findOne(option);
  }
}
