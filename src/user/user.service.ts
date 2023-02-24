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
    const userIdDB = await this.prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
      },
    });
    if (userId) {
      if (userId == userIdDB?.id) {
        const message = await this.prisma.message.findMany({
          where: {
            author: {
              username: username,
            },
          },
        });
        return message;
      } else {
        const message = await this.prisma.message.findMany({
          where: {
            author: {
              username: username,
            },
          },
        });
        message.filter((message) => message.closeFriends.includes(userId));
        return message;
      }
    }
    const message = await this.prisma.message.findMany({
      where: {
        author: {
          username: username,
        },
        isCloseFriends: false,
      },
    });
    return message;
  }
}
