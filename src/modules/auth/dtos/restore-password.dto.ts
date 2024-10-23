import { IsEmail, IsInt, IsString, Length, Max, Min } from "class-validator";

export class RestorePasswordDto {
  @IsString()
  @Length(8, 40)
  password: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(100000)
  @Max(999999)
  verificationCode: number;
}