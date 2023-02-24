import { UserService } from './user.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Message, User } from '@prisma/client';

import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { RtGuard, AtGuard } from '../common/guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('getMessage/:username')
  @HttpCode(HttpStatus.OK)
  getUser(
    @GetCurrentUserId() userId: number | undefined,
    @Param('username') username: string,
  ): Promise<Message[] | undefined> {
    return this.userService.getMessage(userId, username);
  }
}
