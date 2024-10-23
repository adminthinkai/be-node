import { Injectable, Scope } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class SequelizeConfigService implements SequelizeOptionsFactory {
  private dbConfig: any;

  setDbConfig(dbConfig: any) {
    this.dbConfig = dbConfig;
  }

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: this.dbConfig.dbUser,
      password: this.dbConfig.dbPass,
      database: this.dbConfig.dbName,
      autoLoadModels: true,
      synchronize: true,
    };
  }
}
