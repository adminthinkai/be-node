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
import { UserRole } from "src/models/enum/UserRole";
  
  @Injectable()
  export class AdminGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
  
      const authHeader = req.headers.authorization;
  
      req.user = await this.tokenService.verifyAccess(authHeader);
  
      const user = req.user;
  
      if (user.status === UserStatus.BLOCKED) {
        throw new HttpException(UserExceptions.BLOCKED, HttpStatus.FORBIDDEN);
      }

      if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
        throw new HttpException(UserExceptions.ACCESS_DENIED_BY_REQUESTER_ROLE, HttpStatus.FORBIDDEN);
      }
  
      return true;
    }
  }