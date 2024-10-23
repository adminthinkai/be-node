import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Models from './models/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ValidationModule } from './modules/validation/validation.module';
import { TokenModule } from './modules/token/token.module';
import { AppBrandingModule } from './modules/appBranding/appBranding.module';
import { ClassModule } from './modules/class/class.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { FileModule } from './modules/file/file.module';
import { ChatModule } from './modules/messages/chat.module';
import { OpenaiModule } from './openai/openai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ClonesModule } from './modules/clones/clones.module';
import { DatabaseMiddleware } from './database.middleware';
import { DatabaseService } from './database.service';

export const SEQUELIZE_MODELS = [...Object.values(Models)];

@Module({
  providers: [DatabaseService],
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
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
        logging: true,
        autoLoadModels: true,
        sync: { [process.env.SEQUELIZE_SYNC_OPTION]: true },
      }),
    }),
    AuthModule,
    UserModule,
    ClonesModule,
    ValidationModule,
    TokenModule,
    AppBrandingModule,
    ScheduleModule.forRoot(),
    ClassModule,
    AnalyticsModule,
    FileModule,
    ChatModule,
    OpenaiModule,
    NotificationsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DatabaseMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
