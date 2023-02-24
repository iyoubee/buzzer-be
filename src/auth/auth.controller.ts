import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { RtGuard, AtGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @UseGuards(AtGuard)
  @Get('getUser')
  @HttpCode(HttpStatus.OK)
  getUser(@GetCurrentUserId() userId: number): Promise<User | null> {
    return this.authService.getUserData(userId);
  }

  @UseGuards(AtGuard)
  @Get('getCloseFriends')
  @HttpCode(HttpStatus.OK)
  getCloseFriends(
    @GetCurrentUserId() userId: number,
  ): Promise<number[] | undefined> {
    return this.authService.getUserCloseFriends(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
