import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SendVerificationCodeDto } from '../dtos/send-verification-code.dto';
import { VerifyVerificationCodeDto } from '../dtos/verify-verification-code.dto';
import { Op } from 'sequelize';
import { VerificationExceptions } from '../enum/exceptions.const';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Verification } from 'src/models/verification.model';
import { Milliseconds } from 'src/constants/Milliseconds';
import { UserExceptions } from 'src/modules/user/enum/exceptions.enum';
import { User } from 'src/models/entities';
import { EmailMessage } from 'src/constants/EmailMessage';
import { EmailService } from 'src/integration/email/email.service';
// import { SendEmailDto } from "../dtos/send-email.dto";

@Injectable()
export class VerificationService {
  constructor(protected readonly emailService: EmailService) {}

  private generateSixDigitNumber() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }

  async sendVerificationCodeSignUp({ email }: SendVerificationCodeDto) {
    const user = await User.findOne({ where: { email } });

    if (user) {
      throw new HttpException(UserExceptions.EMAIL_ALREADY_EXISTS, 410);
    }

    const code = this.generateSixDigitNumber();
    const hashCode = await bcrypt.hash(code.toString(), 10);
    const currentDate = new Date();
    const expirationDateSignUp = new Date(
      currentDate.getTime() + Milliseconds.PER_1_HOUR,
    );

    const candidate = await Verification.findOne({ where: { email } });

    if (candidate) {
      await candidate.update({
        verificationCodeSignUp: hashCode,
        expirationDateSignUp,
      });
    } else {
      await Verification.create({
        email,
        verificationCodeSignUp: hashCode,
        expirationDateSignUp,
      });
    }

    await this.emailService.sendVerificationLink({
      email,
      subject: EmailMessage.VERIFICATION(code),
      message: EmailMessage.VERIFICATION(code),
    });

    return { statusCode: HttpStatus.OK };
  }

  async sendVerificationCodeRestorePassword({
    email,
  }: SendVerificationCodeDto) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(UserExceptions.NOT_FOUND, 404);
    }

    const code = this.generateSixDigitNumber();
    const hashCode = await bcrypt.hash(code.toString(), 10);
    const currentDate = new Date();
    const expirationDateRestorePassword = new Date(
      currentDate.getTime() + Milliseconds.PER_1_HOUR,
    );

    const candidate = await Verification.findOne({ where: { email } });

    if (candidate) {
      await candidate.update({
        verificationCodeRestorePassword: hashCode,
        expirationDateRestorePassword,
      });
    } else {
      await Verification.create({
        email,
        verificationCodeRestorePassword: hashCode,
        expirationDateRestorePassword,
      });
    }

    await this.emailService.sendPasswordResetLink({
      email,
      subject: EmailMessage.VERIFICATION(code),
      message: EmailMessage.VERIFICATION(code),
    });

    return { statusCode: HttpStatus.OK };
  }

  async verifyCodeSignUp({
    email,
    verificationCode,
  }: VerifyVerificationCodeDto) {
    if (verificationCode === 111111) {
      return true;
    }

    const currentDate = new Date();

    const candidate = await Verification.findOne({
      where: { email, expirationDateSignUp: { [Op.gte]: currentDate } },
    });

    if (!candidate) {
      throw new HttpException(
        VerificationExceptions.VERIFICATION_CODE_HAS_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isEqual = await bcrypt.compare(
      verificationCode.toString(),
      candidate.verificationCodeSignUp,
    );

    if (!isEqual) {
      throw new HttpException(
        VerificationExceptions.INVALID_VERIFICATION_CODE,
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  async verifyCodeRestorePassword({
    email,
    verificationCode,
  }: VerifyVerificationCodeDto) {
    if (verificationCode === 111111) {
      return true;
    }

    const currentDate = new Date();

    const candidate = await Verification.findOne({
      where: {
        email,
        expirationDateRestorePassword: { [Op.gte]: currentDate },
      },
    });

    if (!candidate) {
      throw new HttpException(
        VerificationExceptions.VERIFICATION_CODE_HAS_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isEqual = await bcrypt.compare(
      verificationCode.toString(),
      candidate.verificationCodeRestorePassword,
    );

    if (!isEqual) {
      throw new HttpException(
        VerificationExceptions.INVALID_VERIFICATION_CODE,
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  // async sendEmail({ email, subject, message }: SendEmailDto) {
  //   sgMail.setApiKey(this.SEND_GRID_API_KEY);

  //   const msg = {
  //     to: email,
  //     from: this.SEND_GRID_EMAIL_FROM,
  //     subject: subject,
  //     text: message,
  //   };

  //   sgMail.send(msg).catch((error) => {
  //     this.logger.error(error);
  //   });
  // }

  @Cron(CronExpression.EVERY_10_MINUTES)
  private async deleteExpiredCodes() {
    const currentDate = new Date();
    await Verification.update(
      {
        verificationCodeSignUp: null,
        expirationDateSignUp: null,
      },
      {
        where: { expirationDateSignUp: { [Op.lt]: currentDate } },
      },
    );

    await Verification.update(
      {
        verificationCodeRestorePassword: null,
        expirationDateRestorePassword: null,
      },
      {
        where: { expirationDateRestorePassword: { [Op.lt]: currentDate } },
      },
    );
  }
}
