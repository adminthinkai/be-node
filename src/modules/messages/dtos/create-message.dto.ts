import { IsBoolean, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  message: string;

  @IsBoolean()
  isInternal: boolean;
}
