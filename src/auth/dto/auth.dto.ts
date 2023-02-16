import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator/types/decorator/decorators';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
