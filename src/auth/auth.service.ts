import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signupLocal(dto: SignUpDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);

    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  signinLocal() {}
  logout() {}
  refreshTokens() {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'at-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'rt-secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hasedRt: hash,
      },
    });
  }
}
