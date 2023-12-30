import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto, SignInDto } from '../dtos/auth.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/auth.interfaces';
import { JwtService } from '@nestjs/jwt';
import { RESPONSE_MESSAGE } from 'src/configs/constants';
@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository, private jwtService: JwtService,) { }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;
    const user = await this.usersRepository.findOne({ email });
    if (!user) throw new UnauthorizedException(RESPONSE_MESSAGE.INVALID_CREDENTIAL);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { email } = user;
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(RESPONSE_MESSAGE.INVALID_CREDENTIAL);
    }
  }

  async signUp(createUserDto: SignUpDto): Promise<void> {
    await this.usersRepository.create(createUserDto);
  }
}
