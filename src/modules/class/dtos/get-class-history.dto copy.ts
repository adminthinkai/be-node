import { Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class GetClassHistoryDto {
  @IsOptional()
  @IsString()
  sortDirection?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  size: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @IsUUID("4")
  classId: string;
}
