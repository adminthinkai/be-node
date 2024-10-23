import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { UserStatus } from "src/models/enum/UserStatus";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  lastName?: string;

  @IsOptional() 
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  country?: string;
  
  @IsUUID("4")
  userId: string;
}
