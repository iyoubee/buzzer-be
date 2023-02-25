import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloseFriendsDto } from './dto/closeFriends.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { EditMessageDto } from './dto/editMessage.dto';
import { EditUserDto } from './dto/editUser.dto';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async simple(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  }

  async editUser(userId: number, dto: EditUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: dto.username,
        bio: dto.bio,
      },
    });

    return user;
  }

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
        include: {
          author: true,
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

  async editMessage(userId: number, dto: EditMessageDto): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: {
        id: dto.messageId,
      },
      select: {
        author: {
          select: { id: true },
        },
      },
    });

    if (message?.author.id == userId) {
      const res = await this.prisma.message.update({
        where: {
          id: dto.messageId,
        },
        data: {
          message: dto.message,
        },
      });
      return res;
    } else {
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  async deleteMessage(userId: number, dto: DeleteMessageDto): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: {
        id: dto.messageId,
      },
      select: {
        author: {
          select: { id: true },
        },
      },
    });

    if (message?.author.id == userId) {
      const res = await this.prisma.message.delete({
        where: {
          id: dto.messageId,
        },
      });
      return res;
    } else {
      throw new ForbiddenException('Credentials incorrect');
    }
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
