import { IsNotEmpty, IsNumber } from 'class-validator';

export class CloseFriendsDto {
  @IsNotEmpty()
  @IsNumber()
  closeFriendsId: number;
}
