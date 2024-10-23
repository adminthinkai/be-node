import { Transform } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ClassCategory } from "src/models/enum/ClassCategory";

export class GetManyClassesDto {
  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsString()
  sortDirection?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  size: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(ClassCategory, { each: true })
  categories?: ClassCategory[];

  @IsOptional()
  @IsString()
  keySearchValue?: string;
}
