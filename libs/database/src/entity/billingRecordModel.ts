import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CustomersBillingPortalModel } from './customerBillingPortalModel';
import { ProductRecordModel } from './productRecordModel';

@Table({
  tableName: 'billing_record',
  timestamps: true,
  underscored: true,
})
export class BillingRecordModel extends Model<BillingRecordModel> {
  @ForeignKey(() => CustomersBillingPortalModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customerId!: number;

  @ForeignKey(() => ProductRecordModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId!: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  override createdAt!: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  premiumPaid!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  createdByUserId!: number;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: true,
  })
  override updatedAt!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  updatedByUserId!: number;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  override deletedAt!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  deletedByUserId!: number;

  @BelongsTo(() => CustomersBillingPortalModel)
  customer!: CustomersBillingPortalModel;

  @BelongsTo(() => ProductRecordModel)
  product!: ProductRecordModel;
}
