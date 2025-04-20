import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingMainModule } from '../modules/billing-module.module';
import { AppConfigModule } from '@app-zurich-backend/shared';

@Module({
  imports: [BillingMainModule, AppConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
