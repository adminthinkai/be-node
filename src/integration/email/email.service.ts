import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(protected readonly mailerService: MailerService) {}

  public async sendVerificationLink({
    email,
    subject,
    message,
  }): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        subject: subject,
        template: './sign-up-verification',
        context: {
          code: message,
        },
      })
      .catch((err) => {
        throw new ServiceUnavailableException({
          description: 'Mailer Service is unavailable',
          cause: err,
        });
      });
  }

  public async sendPasswordResetLink({
    email,
    subject,
    message,
  }): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        subject: subject,
        template: './forgot-password',
        context: {
          code: message,
        },
      })
      .catch((err) => {
        throw new ServiceUnavailableException({
          description: 'Mailer Service is unavailable',
          cause: err,
        });
      });
  }

  public async sendPassword({ email, subject, message }): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        subject: subject,
        template: './send-password',
        context: {
          password: message,
        },
      })
      .catch((err) => {
        throw new ServiceUnavailableException({
          description: 'Mailer Service is unavailable',
          cause: err,
        });
      });
  }

  public async sendHelpReq({ email, subject, message }): Promise<void> {
    await this.mailerService
      .sendMail({
        to: 'carlos.torres@thinkhr.ai',
        subject: subject,
        template: './send-help-request',
        context: {
          message,
        },
      })
      .catch((err) => {
        throw new ServiceUnavailableException({
          description: 'Mailer Service is unavailable',
          cause: err,
        });
      });
  }
}
