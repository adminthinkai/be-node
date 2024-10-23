import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from "class-validator";
import { ClassCategory } from "src/models/enum/ClassCategory";

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  prompt?: string;

  @IsOptional() 
  @IsEnum(ClassCategory)
  category?: ClassCategory;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  input1?: string;

  @IsOptional()
  @IsString()
  input2?: string;

  @IsOptional()
  @IsString()
  input3?: string;

  @IsOptional()
  @IsString()
  input4?: string;

  @IsOptional()
  @IsString()
  placeholderInput1?: string;

  @IsOptional()
  @IsString()
  placeholderInput2?: string;

  @IsOptional()
  @IsString()
  placeholderInput3?: string;

  @IsOptional()
  @IsString()
  placeholderInput4?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  public?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  iconNumber?: number;

  @IsUUID("4")
  classId: string;
}
