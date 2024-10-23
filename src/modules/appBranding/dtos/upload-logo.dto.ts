import { IsUUID } from 'class-validator';

export class UploadLogoDto {
  @IsUUID('4')
  id: string;
}