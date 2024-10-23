import { IsUUID } from "class-validator";

export class DeleteNotificationDto {
  @IsUUID("4")
  id: string;
}
