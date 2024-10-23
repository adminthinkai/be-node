import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserCredentialsService } from "../user/services/user-credentials.service";
import { JwtService } from "@nestjs/jwt";
import { JwtUserDto } from "../user/dtos/jwt-user.dto";
import { UserExceptions } from "../user/enum/exceptions.enum";
import { User } from "../../models/user.model";

@Injectable()
export class TokenService {
  constructor(
    private readonly userCredentialsService: UserCredentialsService,
    private readonly jwtService: JwtService
  ) {}

  private validateHeader(authHeader?: string) {
    if (!authHeader) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    let user: JwtUserDto;

    try {
      user = this.jwtService.verify(token);
    } catch {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!user.id) {
      throw new HttpException(
        UserExceptions.OUTDATED_AUTH_TOKEN,
        HttpStatus.BAD_REQUEST
      );
    }

    return { token, user };
  }

  async verifyRefresh(authHeader?: string) {
    const { token } = this.validateHeader(authHeader);

    const userE = await this.userCredentialsService.getByRefreshToken(token);

    if (!userE) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    await this.userCredentialsService.updateLastActivity(userE.userId);

    return userE.user;
  }

  async verifyAccess(authHeader?: string) {
    const { user } = this.validateHeader(authHeader);

    const userE = await this.userCredentialsService.getByUserId(user.id);
    if (!userE || !userE.refreshToken) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    await this.userCredentialsService.updateLastActivity(user.id);

    return userE.user;
  }

  async verifyVerification(token: string) {
    let data = null;

    try {
      data = this.jwtService.verify(token);
    } catch {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return { userId: data.userId };
  }

  generateAuthTokens(user: User) {
    const payload = new JwtUserDto(user);

    return {
      accessToken: this.jwtService.sign({ ...payload }, { expiresIn: "100d" }),
      refreshToken: this.jwtService.sign({ ...payload }, { expiresIn: "90d" }),
    };
  }

  generateVerificationToken(userId: string) {
    return {
      verificationToken: this.jwtService.sign(
        { userId },
        { expiresIn: "30d" }
      ),
    };
  }
}
