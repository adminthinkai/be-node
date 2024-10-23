import { IsUUID } from "class-validator";

export class DeleteClassDto {
  @IsUUID("4")
  id: string;
}
