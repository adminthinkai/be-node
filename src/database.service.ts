import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE_MODELS } from './app.module';

@Injectable()
export class DatabaseService {
  private connections: Map<string, Sequelize> = new Map();

  async getConnection(config: any): Promise<Sequelize> {
    if (this.connections.has(config)) {
      return this.connections.get(config);
    }

    const sequelize = new Sequelize(
      config
        ? config
        : {
            dialect: 'postgres',
            models: SEQUELIZE_MODELS,
            host: process.env.SEQUELIZE_HOST,
            port: +process.env.SEQUELIZE_PORT,
            //comment when dev servers
            // dialectOptions: {
            //   ssl: {
            //     require: true,
            //     rejectUnauthorized: false,
            //   },
            // },
            username: process.env.SEQUELIZE_USERNAME,
            password: process.env.SEQUELIZE_PASSWORD,
            database: process.env.SEQUELIZE_DB,
          },
    );

    this.connections.set('postgres', sequelize);
    return sequelize;
  }
}
