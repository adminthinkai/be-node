import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TokenService } from "src/modules/token/token.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    req.user = await this.tokenService.verifyRefresh(authHeader);

    return true;
  }
}
