import { UserService } from './../user/services/user.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  ChatsMessages,
  Class,
  ClassHistory,
  Clone,
  User,
} from 'src/models/entities';
import { UserStatus } from 'src/models/enum/UserStatus';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as moment from 'moment';
import { ChatRole } from 'src/models/enum/ChatRole';
import { SEQUELIZE_MODELS } from 'src/app.module';
import { UserRole } from 'src/models/enum/UserRole';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClonesService {
  private readonly logger = new Logger(ClonesService.name);
  constructor(private readonly userService: UserService) {}

  async create(data: any) {
    const user = await this.userService.getMe(data.adminId);

    data.email = user.email;
    let created: Partial<Clone> = {};

    created = await Clone.create(data);

    const defaultSequelize = new Sequelize({
      dialect: 'postgres',
      models: SEQUELIZE_MODELS,
      host: data.servername,
      port: 5432,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      username: data.username,
      password: data.password,
      database: data.dbname,
    });

    try {
      await defaultSequelize.authenticate();
    } catch (err) {
      const defaultSequelize = new Sequelize({
        dialect: 'postgres',
        models: SEQUELIZE_MODELS,
        host: process.env.SEQUELIZE_HOST,
        port: +process.env.SEQUELIZE_PORT,
        username: process.env.SEQUELIZE_USERNAME,
        password: process.env.SEQUELIZE_PASSWORD,
        database: process.env.SEQUELIZE_DB,
      });
      if (created.id) {
        try {
          await defaultSequelize.model('Clone').destroy({
            where: { id: created.id },
            individualHooks: true,
            hooks: true,
            cascade: true,
          });
        } catch (e) {
          console.log(e);
        }
      }

      console.error('Unable to connect to the database:', err);
      throw new HttpException(
        'Unable connect to new database',
        HttpStatus.BAD_REQUEST,
      );

      //throw new Error('Database connection failed. Please check credentials.');
    }

    defaultSequelize.addModels(SEQUELIZE_MODELS);
    await defaultSequelize.sync({ alter: true });

    const createdUser: any = await defaultSequelize.model('User').create({
      email: user.email,
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
    });

    const hashPassword = await bcrypt.hash(data.password, 10);

    defaultSequelize.model('UserCredential').update(
      { password: hashPassword },
      {
        where: {
          userId: createdUser.dataValues.id,
        },
      },
    );

    return created;
  }

  async getClone() {
    return Clone.findOne({
      where: { id: 'b2b413ff-3b6c-4c32-9430-4d9e5454416c' },
    });
  }

  async getCloneByEmail(email: any) {
    return Clone.findOne({
      where: { email },
    });
  }
}
