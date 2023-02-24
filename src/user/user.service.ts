import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getMessage(
    userId: number | undefined,
    username: string,
  ): Promise<Message[] | undefined> {
    const message = await this.prisma.message.findMany({
      where: {
        author: {
          username: username,
        },
        OR: {
          isCloseFriends: false,
          closeFriends: {
            has: userId,
          },
        },
      },
    });
    return message;
  }

  async sendPublicMessage(userId: number, dto: MessageDto): Promise<Message> {
    const res = await this.prisma.message.create({
      data: {
        userId: userId,
        message: dto.message,
      },
    });
    return res;
  }

  async sendPrivateMessage(userId: number, dto: MessageDto): Promise<Message> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        closeFriends: true,
      },
    });

    const res = await this.prisma.message.create({
      data: {
        userId: userId,
        message: dto.message,
        isCloseFriends: true,
        closeFriends: user?.closeFriends,
      },
    });
    return res;
  }
}
