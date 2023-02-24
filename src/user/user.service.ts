import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
