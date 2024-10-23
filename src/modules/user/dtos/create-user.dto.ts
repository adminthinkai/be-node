import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { UserStatus } from "src/models/enum/UserStatus";
import { UserRole } from "../../../models/enum/UserRole";

export class CreateUserDto {
  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @Length(3, 50)
  firstName?: string;

  @IsString()
  @Length(3, 50)
  lastName?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
