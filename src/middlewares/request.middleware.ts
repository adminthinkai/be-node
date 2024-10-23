// request.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize';
import { ClonesService } from 'src/modules/clones/clones.service';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly cloneService: ClonesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const dbConfig: any = {};
    const clone = await this.cloneService.getClone();

    const sequelize = new Sequelize({
      dialect: 'postgres',
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
      database: 'postgres',
    });

    await sequelize.authenticate();
    req['sequelize'] = sequelize;
    next();
  }
}
