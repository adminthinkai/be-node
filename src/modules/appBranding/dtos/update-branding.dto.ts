import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { BackgroundColorType } from "src/models/enum/BackgroundColorType";

export class UpdateAppBrandingDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional() 
  @IsEnum(BackgroundColorType)
  backgroundColorType?: BackgroundColorType;

  @IsOptional()
  @IsString()
  backgroundColorFirst?: string;

  @IsOptional()
  @IsString()
  backgroundColorSecond?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  usingInternalData?: boolean;
  
  @IsUUID("4")
  id: string;
}
