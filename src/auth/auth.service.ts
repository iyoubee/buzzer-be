import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signupLocal(dto: AuthDto) {
    // const newUser = this.prisma.user.create({
    //   data: {
    //     username: dto.username,
    //   }
    // })
  }
  signinLocal() {}
  logout() {}
  refreshTokens() {}
}
