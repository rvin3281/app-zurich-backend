import { AppConfigModule, AppConfigService } from '@app-zurich-backend/shared';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeOptions } from 'sequelize-typescript';
import { BillingRecordModel } from './billingRecordModel';
import { CustomersBillingPortalModel } from './customerBillingPortalModel';
import { ProductRecordModel } from './productRecordModel';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService): SequelizeOptions => {
        const dbConfig: object = configService.database || {};
        return {
          ...dbConfig,
          models: [CustomersBillingPortalModel, ProductRecordModel, BillingRecordModel],
        };
      },
      inject: [AppConfigService],
    }),
  ],
  exports: [SequelizeModule],
})
export class BillingEntityModule {}
