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
import { MessageDto } from './dto/message.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('getMessage/:username')
  @HttpCode(HttpStatus.OK)
  getMessage(
    @GetCurrentUserId() userId: number | undefined,
    @Param('username') username: string,
  ): Promise<Message[] | undefined> {
    return this.userService.getMessage(userId, username);
  }

  @UseGuards(AtGuard)
  @Post('post/message/public')
  @HttpCode(HttpStatus.OK)
  sendPublicMessage(
    @GetCurrentUserId() userId: number,
    @Body() dto: MessageDto,
  ): Promise<Message> {
    return this.userService.sendPublicMessage(userId, dto);
  }

  @UseGuards(AtGuard)
  @Post('post/message/private')
  @HttpCode(HttpStatus.OK)
  sendPrivateMessage(
    @GetCurrentUserId() userId: number,
    @Body() dto: MessageDto,
  ): Promise<Message> {
    return this.userService.sendPrivateMessage(userId, dto);
  }
}
