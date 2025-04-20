import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { BillingRecordModel } from './billingRecordModel';

@Table({
  tableName: 'products_records',
  timestamps: true,
  underscored: true,
})
export class ProductRecordModel extends Model<ProductRecordModel> {
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  productCode!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  location!: string;

  @HasMany(() => BillingRecordModel, { foreignKey: 'productId' })
  billingRecords!: BillingRecordModel[];
}
