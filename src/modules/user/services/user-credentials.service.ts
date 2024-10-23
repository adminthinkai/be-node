import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ISaveInfoCred } from "../interfaces/ISaveInfoCred";
import * as bcrypt from "bcrypt";
import { UserCredential } from "../../../models/userCredentials.model";
import { UserExceptions } from "../enum/exceptions.enum";
import { IVerificationTokenCred } from "../interfaces/IVerificationTokenCred";
import { User } from "../../../models/user.model";
import { UserStatus } from "../../../models/enum/UserStatus";
import { ValidationService } from "src/modules/validation/validation.service";

@Injectable()
export class UserCredentialsService {
  constructor(private readonly validationService: ValidationService) {}

  async savePassword({
    userId,
    password,
  }: Omit<ISaveInfoCred, "refreshToken">) {
    const hashPassword = await bcrypt.hash(password, 10);

    return UserCredential.update(
      { password: hashPassword },
      {
        where: {
          userId,
        },
      }
    );
  }

  async validatePassword(email: string, password: string) {
    await this.validationService.getModelWithThrow({
      modelCtor: User,
      criteria: { email },
      message: UserExceptions.NOT_FOUND,
    });

    const { user, password: hashPassword } = await UserCredential.findOne({
      include: [
        {
          model: User,
          where: { email },
          attributes: ["id", "role", "email", "status"],
        },
      ],
    });

    if (user.status === UserStatus.BLOCKED) {
      throw new HttpException(UserExceptions.BLOCKED, HttpStatus.FORBIDDEN);
    }

    if (!hashPassword) {
      throw new HttpException(
        UserExceptions.INVALID_EMAIL_OR_PASSWORD,
        HttpStatus.BAD_REQUEST
      );
    }

    const isEqual = await bcrypt.compare(password, hashPassword);

    if (!isEqual) {
      throw new HttpException(
        UserExceptions.INVALID_EMAIL_OR_PASSWORD,
        HttpStatus.BAD_REQUEST
      );
    }

    return user;
  }

  async updateLastActivity(id: string) {
    return User.update({ lastActivity: new Date() }, { where: { id } });
  }

  async updateSignUpDate(id: string) {
    return User.update({ signUpDate: new Date() }, { where: { id } });
  }

  async getByUserId(id: string) {
    return UserCredential.findOne({
      where: { userId: id },
      include: [
        {
          model: User,
          where: { status: UserStatus.ACTIVE },
          attributes: [
            "id",
            "role",
            "email",
            "status",
          ],
        },
      ],
    });
  }

  async getByRefreshToken(token: string) {
    return UserCredential.findOne({
      where: { refreshToken: token },
      include: [
        {
          model: User,
          where: { status: UserStatus.ACTIVE },
          attributes: [
            "id",
            "role",
            "email",
            "status",
          ],
        },
      ],
    });
  }

  async getByVerificationToken(token: string) {
    return UserCredential.findOne({
      where: { verificationToken: token },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "role",
            "email",
            "status",
          ],
        },
      ],
    });
  }

  async saveRefreshToken({
    userId,
    refreshToken,
  }: Omit<ISaveInfoCred, "password">) {
    const candidate = await this.validationService.getModelWithThrow({
      modelCtor: UserCredential,
      criteria: { userId },
      message: UserExceptions.NOT_FOUND,
    });

    return candidate.update({ refreshToken });
  }

  async saveVerificationToken({
    userId,
    verificationToken,
  }: IVerificationTokenCred) {

    const candidate = await this.validationService.getModelWithThrow({
      modelCtor: UserCredential,
      criteria: { userId },
      message: UserExceptions.NOT_FOUND,
    });

    return candidate.update({ verificationToken });
  }
}
