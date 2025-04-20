import { Module } from '@nestjs/common';
import { BillingEntityModule } from '@app-zurich-backend/database';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [BillingEntityModule, BillingModule],
  exports: [BillingModule],
})
export class BillingMainModule {}
