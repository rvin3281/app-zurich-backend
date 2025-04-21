import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get database(): SequelizeModuleOptions {
    return {
      dialect: this.configService.get<string>('DB_DIALECT') as Dialect,
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      name: this.configService.get<string>('DB_NAME'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      autoLoadModels: true,
      logging: console.log,
    };
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get swaggerConfig() {
    return {
      app_name: this.configService.get('APP_NAME'),
      app_desc: this.configService.get('APP_DESC'),
      app_version: this.configService.get('APP_DESC'),
    };
  }
}
