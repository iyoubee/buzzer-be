import { IsNotEmpty, IsString } from 'class-validator';

export class EditMessageDto {
  @IsNotEmpty()
  @IsString()
  messageId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
