import { IsEmail, IsString, Length } from "class-validator";

export class CreateSuperAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 40)
  password: string;
}
