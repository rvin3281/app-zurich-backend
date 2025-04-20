import {
  BillingRecordModel,
  BillingRecordRepository,
  CustomerPortalRepository,
  CustomersBillingPortalModel,
  ProductRecordModel,
  ProductRecordRepository,
} from '@app-zurich-backend/database';
import { AppConfigModule, RolesGuard } from '@app-zurich-backend/shared';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BillingRecordModel,
      CustomersBillingPortalModel,
      ProductRecordModel,
    ]),
    AppConfigModule,
  ],
  controllers: [BillingController],
  providers: [
    BillingService,
    BillingRecordRepository,
    CustomerPortalRepository,
    ProductRecordRepository,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class BillingModule {}
