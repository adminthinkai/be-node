import { Transform } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { UserRole } from "src/models/enum/UserRole";
import { UserStatus } from "src/models/enum/UserStatus";

export class GetManyUsersDto {
  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsString()
  sortDirection?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(UserStatus, { each: true })
  statuses?: UserStatus[];

  @IsOptional()
  // @IsDateString()
  startLastActivity?: Date;

  @IsOptional()
  // @IsDateString()
  endLastActivity?: Date;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  size: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @IsOptional()
  @IsString()
  keySearchValue?: string;
}
