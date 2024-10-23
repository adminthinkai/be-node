import { IsEmail, IsString, Length } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @Length(8, 40)
  password: string;

  @IsString()
  @Length(8, 40)
  newPassword: string;

  @IsEmail()
  email: string;
}