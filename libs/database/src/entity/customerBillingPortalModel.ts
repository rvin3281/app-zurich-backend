import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { BillingRecordModel } from './billingRecordModel';

@Table({
  tableName: 'customer_billing_portal',
  timestamps: true,
  underscored: true,
})
export class CustomersBillingPortalModel extends Model<CustomersBillingPortalModel> {
  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  lastName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  photo!: string;

  @HasMany(() => BillingRecordModel, { foreignKey: 'customerId' })
  billingRecords!: BillingRecordModel[];
}
