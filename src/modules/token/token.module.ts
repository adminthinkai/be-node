import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UserCredentialsService } from "../user/services/user-credentials.service";
import { ValidationModule } from "../validation/validation.module";

@Module({
  imports: [ValidationModule],
  providers: [TokenService, UserCredentialsService],
  exports: [TokenService],
})
export class TokenModule {}
