import { IsEmail, IsString, Length} from "class-validator";

export class SignInDto {
  @IsString()
  @Length(8, 40)
  password: string;

  @IsEmail()
  email: string;
}
