import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetManyFilesDto {
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
  @Transform(({ value }) => Number(value))
  @IsNumber()
  startSize?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  endSize?: number;

  @IsOptional()
  // @IsDateString()
  startCreationDate?: Date;

  @IsOptional()
  // @IsDateString()
  endCreationDate?: Date;

  @IsOptional()
  @IsString()
  keySearchValue?: string;
}
