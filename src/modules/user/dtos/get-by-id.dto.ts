import { IsOptional, IsUUID } from "class-validator";

export class GetByIdDto {
  @IsOptional()
  @IsUUID("4")
  id?: string;
}
