import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloseFriendsDto } from './dto/closeFriends.dto';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getMessage(username: string): Promise<Message[] | undefined> {
    const message = await this.prisma.message.findMany({
      where: {
        author: {
          username: username,
        },
        isCloseFriends: false,
      },
      include: {
        author: true,
      },
    });
    return message;
  }

  async getMessageAuthed(
    userId: number,
    username: string,
  ): Promise<Message[] | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user?.username != username) {
      const message = await this.prisma.message.findMany({
        where: {
          // author: { username: username },
          OR: [
            {
              AND: [
                { author: { username: username } },
                { isCloseFriends: true },
                {
                  closeFriends: {
                    some: {
                      id: userId,
                    },
                  },
                },
              ],
            },
            {
              AND: [
                { author: { username: username } },
                { isCloseFriends: false },
              ],
            },
          ],
        },
        include: {
          author: true,
        },
      });
      return message;
    } else {
      const message = await this.prisma.message.findMany({
        where: {
          author: { username: username },
        },
      });
      return message;
    }
  }

  async getAllMessage(): Promise<Message[] | undefined> {
    const message = await this.prisma.message.findMany({
      where: {
        isCloseFriends: false,
      },
      include: {
        author: true,
      },
    });
    return message;
  }

  async getAllMessageAuth(userId: number): Promise<Message[] | undefined> {
    const message = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            closeFriends: {
              some: { id: userId },
            },
          },
          {
            isCloseFriends: false,
          },
          {
            author: { id: userId },
          },
        ],
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
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
        closeFriending: true,
      },
    });

    const res = await this.prisma.message.create({
      data: {
        userId: userId,
        message: dto.message,
        isCloseFriends: true,
      },
    });

    await this.prisma.message.update({
      where: {
        id: res.id,
      },
      data: {
        closeFriends: {
          connect: user?.closeFriending.map((c) => ({ id: c.id })),
        },
      },
    });
    return res;
  }

  async getAllUser(): Promise<any[]> {
    const user = await this.prisma.user.findMany({
      orderBy: {
        username: 'asc',
      },
    });
    return user;
  }

  async connectCloseFriends(
    userId: number,
    dto: CloseFriendsDto,
  ): Promise<User> {
    const res = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        closeFriending: {
          connect: { id: dto.closeFriendsId },
        },
      },
    });
    return res;
  }

  async disconnectCloseFriends(
    userId: number,
    dto: CloseFriendsDto,
  ): Promise<User> {
    const res = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        closeFriending: {
          disconnect: { id: dto.closeFriendsId },
        },
      },
    });
    return res;
  }
}
