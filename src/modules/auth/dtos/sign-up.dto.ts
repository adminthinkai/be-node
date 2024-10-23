import { IsEmail, IsInt, IsString, Length, Max, Min } from "class-validator";

export class SignUpDto {
  @IsString()
  @Length(8, 40)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsInt()
  @Min(100000)
  @Max(999999)
  verificationCode: number;
}
