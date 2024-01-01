import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/auth.interfaces';
import { UsersService } from 'src/users/services/users.service';
import { RESPONSE_MESSAGE } from 'src/configs/constants';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { userId } = payload;
    const user: User = await this.usersService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException(RESPONSE_MESSAGE.INVALID_CREDENTIAL);
    }
    return user;
  }
}
