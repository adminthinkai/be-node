import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from './database.service';
import { Sequelize } from 'sequelize-typescript';
import { ClonesService } from './modules/clones/clones.service';
import { SEQUELIZE_MODELS } from './app.module';
import { TokenService } from './modules/token/token.service';

@Injectable()
export class DatabaseMiddleware implements NestMiddleware {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloneService: ClonesService,
    private readonly tokenService: TokenService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    let userFromToken;

    if (authHeader) {
      userFromToken = await this.tokenService.verifyAccess(authHeader);
    }

    if (req.originalUrl === '/clone/create') {
      next();
      return;
    }

    let tempEmail = '';
    if (req.originalUrl === '/auth/sign-in') {
      tempEmail = req?.body?.email;
    }
    if (userFromToken?.dataValues?.email) {
      tempEmail = userFromToken?.dataValues?.email;
    }
    if (tempEmail) {
      const defaultSequelize = new Sequelize({
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
      });

      const clone: any = await defaultSequelize
        .model('Clone')
        .findOne({ where: { email: tempEmail } });
      if (clone) {
        req.databaseconfig = {
          dialect: 'postgres',
          models: SEQUELIZE_MODELS,
          host: clone.servername,
          port: 5432,
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
          username: clone.username,
          password: clone.password,
          database: clone.dbname,
        };

        const connection: Sequelize = await this.databaseService.getConnection(
          req.databaseconfig,
        );
        (req as any).dbConnection = connection;
      }
    } else {
      req.databaseconfig = {
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
      };

      const connection: Sequelize = await this.databaseService.getConnection(
        req.databaseconfig,
      );
      (req as any).dbConnection = connection;
    }

    next();
    return;
  }
}
