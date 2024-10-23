import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { UserExceptions } from "src/modules/user/enum/exceptions.enum";
import { UserStatus } from "src/models/enum/UserStatus";
import { TokenService } from "src/modules/token/token.service";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    req.user = await this.tokenService.verifyAccess(authHeader);

    const user = req.user;

    if (user.status === UserStatus.BLOCKED) {
      throw new HttpException(UserExceptions.BLOCKED, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
