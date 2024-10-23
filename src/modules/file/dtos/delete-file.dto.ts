import { IsUUID } from "class-validator";

export class DeleteFileDto {
  @IsUUID("4")
  id: string;
}
