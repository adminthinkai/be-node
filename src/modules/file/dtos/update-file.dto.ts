import {
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsUUID("4")
  id: string;
}
