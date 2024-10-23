import { IsEmail, IsInt, Max, Min } from "class-validator";

export class VerifyVerificationCodeDto {
  @IsEmail()
  email: string;

  @IsInt()
  @Min(100000)
  @Max(999999)
  verificationCode: number;
}
