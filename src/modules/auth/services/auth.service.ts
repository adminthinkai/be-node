import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/dtos/create-user.dto';
import { VerificationService } from './verification.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { User } from '../../../models/user.model';
import { UserCredentialsService } from '../../user/services/user-credentials.service';
import { TokenService } from '../../token/token.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { UserRole } from 'src/models/enum/UserRole';
import { UserStatus } from 'src/models/enum/UserStatus';
import * as generator from 'generate-password';
import { UserExceptions } from 'src/modules/user/enum/exceptions.enum';
import { RestorePasswordDto } from '../dtos/restore-password.dto';
import { EmailService } from 'src/integration/email/email.service';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { EmailMessage } from 'src/constants/EmailMessage';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    protected readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly verificationService: VerificationService,
    private readonly userCredentialsService: UserCredentialsService,
  ) {}

  async sendHelpRequest({ message }: any, email: string) {
    await this.emailService.sendHelpReq({
      email,
      subject: `Help Request from ${email}`,
      message: message,
    });
  }

  async sendInvitation(
    { email, ...pureUser }: CreateUserDto,
    creatorRole: string,
  ) {
    if (creatorRole !== UserRole.SUPERADMIN) {
      if (
        pureUser.role === UserRole.ADMIN ||
        pureUser.role === UserRole.SUPERADMIN
      ) {
        throw new HttpException(
          UserExceptions.ACCESS_DENIED_BY_REQUESTER_ROLE,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    const created = await this.userService.createUser({
      email,
      ...pureUser,
    });

    const password = generator.generate({
      length: 10,
      numbers: true,
      excludeSimilarCharacters: true,
    });

    await this.emailService.sendPassword({
      email,
      subject: 'Your password',
      message: password,
    });

    await this.userCredentialsService.savePassword({
      userId: created.id,
      password,
    });

    return { email: email, password: password };
  }

  async checkEmail({ email }: CheckEmailDto) {
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw new HttpException(UserExceptions.EMAIL_ALREADY_EXISTS, 410);
    }

    return { statusCode: HttpStatus.OK };
  }

  async signUp({
    password,
    email,
    verificationCode,
    firstName,
    lastName,
  }: SignUpDto) {
    await this.verificationService.verifyCodeSignUp({
      email,
      verificationCode,
    });

    const created = await this.userService.createUser({
      email,
      role: UserRole.USER,
      firstName,
      lastName,
      status: UserStatus.ACTIVE,
    });

    await this.userCredentialsService.savePassword({
      userId: created.id,
      password,
    });

    await this.userCredentialsService.updateSignUpDate(created.id);

    const tokens = this.tokenService.generateAuthTokens(created);

    await this.userService.saveRefreshToken(created.id, tokens.refreshToken);

    return tokens;
  }

  async signIn({ password, email }: SignInDto) {
    const user = await this.userCredentialsService.validatePassword(
      email,
      password,
    );

    if (user.status === UserStatus.BLOCKED) {
      throw new HttpException(UserExceptions.BLOCKED, HttpStatus.FORBIDDEN);
    }

    if (user.status === UserStatus.PENDING) {
      user.update({ status: UserStatus.ACTIVE });
    }

    const tokens = this.tokenService.generateAuthTokens(user);

    await this.userService.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.saveRefreshToken(userId, null);

    return { statusCode: HttpStatus.OK };
  }

  async forgotPassword({
    password,
    email,
    verificationCode,
  }: RestorePasswordDto) {
    await this.verificationService.verifyCodeRestorePassword({
      email,
      verificationCode,
    });

    const user = await this.userService.getByEmail(email);

    await this.userCredentialsService.savePassword({
      userId: user.id,
      password,
    });

    return this.refresh(user);
  }

  async changePassword({ password, email, newPassword }: ChangePasswordDto) {
    const user = await this.userCredentialsService.validatePassword(
      email,
      password,
    );

    return await this.userCredentialsService.savePassword({
      userId: user.id,
      password: newPassword,
    });
  }

  async refresh(user: User) {
    const tokens = this.tokenService.generateAuthTokens(user);

    await this.userService.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
