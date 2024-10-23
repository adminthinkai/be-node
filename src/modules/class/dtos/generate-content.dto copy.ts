import {
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class GenerateContentDto {
  @IsString()
  valueInput1: string;

  @IsOptional()
  @IsString()
  valueInput2?: string;

  @IsOptional()
  @IsString()
  valueInput3?: string;

  @IsOptional()
  @IsString()
  valueInput4?: string;

  @IsUUID("4")
  classId: string;
}
