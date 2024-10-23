import { IsUUID } from "class-validator";

export class DeleteMessageDto {
  @IsUUID("4")
  id: string;
}
