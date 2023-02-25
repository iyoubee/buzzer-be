import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMessageDto {
  @IsNotEmpty()
  @IsString()
  messageId: string;
}
