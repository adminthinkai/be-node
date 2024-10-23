import { IsUUID } from "class-validator";

export class GetOneClassDto {
  @IsUUID("4")
  id: string;
}
