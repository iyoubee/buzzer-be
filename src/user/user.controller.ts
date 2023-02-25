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
  Put,
  Delete,
} from '@nestjs/common';
import { Message, User } from '@prisma/client';

import { Public, GetCurrentUserId } from '../common/decorators';
import { AtGuard } from '../common/guards';
import { MessageDto } from './dto/message.dto';
import { CloseFriendsDto } from './dto/closeFriends.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { EditMessageDto } from './dto/editMessage.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('getMessage/:username')
  @HttpCode(HttpStatus.OK)
  getMessage(
    @Param('username') username: string,
  ): Promise<Message[] | undefined> {
    return this.userService.getMessage(username);
  }

  @UseGuards(AtGuard)
  @Get('getMessageAuthed/:username')
  @HttpCode(HttpStatus.OK)
  getMessageAuthed(
    @GetCurrentUserId() userId: number,
    @Param('username') username: string,
  ): Promise<Message[] | undefined> {
    return this.userService.getMessageAuthed(userId, username);
  }

  @Public()
  @Get('getMessage')
  @HttpCode(HttpStatus.OK)
  getAllMessage(): Promise<Message[] | undefined> {
    return this.userService.getAllMessage();
  }

  @UseGuards(AtGuard)
  @Get('getMessageAuth')
  @HttpCode(HttpStatus.OK)
  getAllMessageAuth(
    @GetCurrentUserId() userId: number,
  ): Promise<Message[] | undefined> {
    return this.userService.getAllMessageAuth(userId);
  }

  @UseGuards(AtGuard)
  @Get('getUser')
  @HttpCode(HttpStatus.OK)
  getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @UseGuards(AtGuard)
  @Post('post/delete')
  @HttpCode(HttpStatus.OK)
  deleteMessage(
    @GetCurrentUserId() userId: number,
    @Body() dto: DeleteMessageDto,
  ): Promise<Message> {
    return this.userService.deleteMessage(userId, dto);
  }

  @UseGuards(AtGuard)
  @Put('post/edit')
  @HttpCode(HttpStatus.OK)
  editMessage(
    @GetCurrentUserId() userId: number,
    @Body() dto: EditMessageDto,
  ): Promise<Message> {
    return this.userService.editMessage(userId, dto);
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

  @UseGuards(AtGuard)
  @Put('closeFriends/disconnect')
  @HttpCode(HttpStatus.OK)
  disconnectCloseFriends(
    @GetCurrentUserId() userId: number,
    @Body() dto: CloseFriendsDto,
  ): Promise<User> {
    return this.userService.disconnectCloseFriends(userId, dto);
  }

  @UseGuards(AtGuard)
  @Put('closeFriends/connect')
  @HttpCode(HttpStatus.OK)
  connectCloseFriends(
    @GetCurrentUserId() userId: number,
    @Body() dto: CloseFriendsDto,
  ): Promise<User> {
    return this.userService.connectCloseFriends(userId, dto);
  }
}
