import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { UserCredentialsService } from './services/user-credentials.service';
import { UserCredential } from '../../models/userCredentials.model';
import { TokenModule } from '../token/token.module';
import { ValidationModule } from '../validation/validation.module';
import { AzureModule } from 'src/integration/azure/azure.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserCredential]),
    ValidationModule,
    TokenModule,
    AzureModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserCredentialsService],
  exports: [UserService, UserCredentialsService],
})
export class UserModule {}
