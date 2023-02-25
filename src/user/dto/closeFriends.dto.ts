import { IsNotEmpty } from 'class-validator';

export class CloseFriendsDto {
  @IsNotEmpty()
  closeFriendsList: any[];
}
