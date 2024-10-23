import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { VerificationService } from './services/verification.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenModule } from '../token/token.module';
import { Verification } from 'src/models/verification.model';
import { config } from 'dotenv';
import { EmailModule } from 'src/integration/email/email.module';

config();

@Module({
  imports: [
    SequelizeModule.forFeature([Verification]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    EmailModule,
    TokenModule,
  ],
  providers: [AuthService, VerificationService],
  controllers: [AuthController],
  exports: [AuthService, VerificationService],
})
export class AuthModule {}
