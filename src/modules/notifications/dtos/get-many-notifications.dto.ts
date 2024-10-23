import { Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class GetManyNotificationsDto {
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
}
