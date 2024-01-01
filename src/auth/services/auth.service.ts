import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import { UsersService } from 'src/users/services/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto, SignInDto } from '../dtos/auth.dto';
import { JwtPayload } from '../interfaces/auth.interfaces';
import { RESPONSE_MESSAGE, SALT_ROUNDS } from 'src/configs/constants';
import { UserDocument } from 'src/users/schemas/user.schema';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getAuthenticatedUser(signInDto: SignInDto): Promise<UserDocument> {
    const { email, password } = signInDto;
    try {
      const user = await this.usersService.getUserByConditional({ email });
      if (!user) {
        throw new UnauthorizedException(RESPONSE_MESSAGE.INVALID_CREDENTIAL);
      }
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException(RESPONSE_MESSAGE.INVALID_CREDENTIAL);
    }
  }

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ) {
    const is_matching = await bcrypt.compare(plainText, hashedText);
    if (!is_matching) {
      throw new UnauthorizedException(RESPONSE_MESSAGE.INVALID_CREDENTIAL);
    }
  }

  async signIn(userId: string): Promise<any> {
    const accessToken = this.generateAccessToken({
      userId,
    });
    const refreshToken = this.generateRefreshToken({
      userId,
    });
    await this.storeRefreshToken(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.createUser(signUpDto);
    const refreshToken = this.generateRefreshToken({
      userId: user._id.toString(),
    });
    await this.storeRefreshToken(user._id.toString(), refreshToken);
    return {
      accessToken: this.generateAccessToken({
        userId: user._id.toString(),
      }),
      refreshToken,
    };
  }

  async storeRefreshToken(user_id: string, token: string): Promise<void> {
    try {
      const hashed_token = await bcrypt.hash(token, SALT_ROUNDS);
      await this.usersService.setCurrentRefreshToken(user_id, hashed_token);
    } catch (error) {
      throw error;
    }
  }

  async getUserIfRefreshTokenMatched(
    userId: string,
    refreshToken: string,
  ): Promise<UserDocument> {
    const user = await this.usersService.getUserByConditional({
      _id: new Types.ObjectId(userId),
    });
    if (!user) {
      throw new UnauthorizedException(RESPONSE_MESSAGE.INVALID_CREDENTIAL);
    }
    await this.verifyPlainContentWithHashedContent(
      refreshToken,
      user.refreshToken,
    );
    return user;
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }

  generatePrivateKeyAndPublicKey() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
    });
    return { publicKey, privateKey };
  }
}
