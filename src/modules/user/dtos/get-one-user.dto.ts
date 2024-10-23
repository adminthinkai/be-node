import { IsUUID } from "class-validator";

export class GetOneUserDto {
  @IsUUID("4")
  id: string;
}
