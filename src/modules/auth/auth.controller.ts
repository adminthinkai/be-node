import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { SendVerificationCodeDto } from './dtos/send-verification-code.dto';
import { VerificationService } from './services/verification.service';
import { VerifyVerificationCodeDto } from './dtos/verify-verification-code.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshTokenGuard } from 'src/guards/refresh-token-guard.service';
import { IReqWithUser } from 'src/interfaces/IReqWithUser';
import { AccessTokenGuard } from 'src/guards/access-token-guard.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AdminGuard } from 'src/guards/admin-guard.service';
import { RestorePasswordDto } from './dtos/restore-password.dto';
import { CheckEmailDto } from './dtos/check-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post('/send-verification-code-sign-up')
  sendVerificationCodeSignUp(@Body() dto: SendVerificationCodeDto) {
    return this.verificationService.sendVerificationCodeSignUp(dto);
  }

  @Post('/send-verification-code-restore-password')
  sendVerificationCodeRestorePassword(@Body() dto: SendVerificationCodeDto) {
    return this.verificationService.sendVerificationCodeRestorePassword(dto);
  }

  @Post('/verify-verification-code-sign-up')
  async verifyVerificationCodeSignUp(@Body() dto: VerifyVerificationCodeDto) {
    await this.verificationService.verifyCodeSignUp(dto);
    return { statusCode: HttpStatus.OK };
  }

  @Post('/verify-verification-code-restore-password')
  async verifyVerificationCodeRestorePassword(
    @Body() dto: VerifyVerificationCodeDto,
  ) {
    await this.verificationService.verifyCodeRestorePassword(dto);
    return { statusCode: HttpStatus.OK };
  }

  @Post('/check-email')
  checkEmail(@Body() dto: CheckEmailDto) {
    return this.authService.checkEmail(dto);
  }

  @Post('/sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @UseGuards(AdminGuard)
  @Post('/send-invitation')
  sendInvitation(@Body() dto: CreateUserDto, @Req() { user }: IReqWithUser) {
    return this.authService.sendInvitation(dto, user.role);
  }

  @UseGuards(AdminGuard)
  @Post('/send-help-request')
  sendHelpRequest(@Body() dto: any, @Req() { user }: IReqWithUser) {
    return this.authService.sendHelpRequest(dto, user.email);
  }

  @Patch('/sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refresh(@Req() { user }: IReqWithUser) {
    return this.authService.refresh(user);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/logout')
  logout(@Req() { user }: IReqWithUser) {
    return this.authService.logout(user.id);
  }

  @Patch('/forgot-password')
  forgotPassword(@Body() dto: RestorePasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/change-password')
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }
}
