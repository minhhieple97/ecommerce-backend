import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dtos/auth.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors/transform-response.interceptor';
import { MongoExceptionFilter } from 'src/common/filters/mongodb-exception.filter';
import { LocalAuthGuard } from '../guards/local.guard';
import { CurrentUser } from '../decorators/auth.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtRefreshTokenGuard } from '../guards/jwt-refresh-token.guard';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
@Controller('auth')
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authService.signIn(user._id.toString());
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UseFilters(MongoExceptionFilter)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshAccessToken(@CurrentUser() user: UserDocument) {
    const accessToken = this.authService.generateAccessToken({
      userId: user._id.toString(),
    });
    return {
      accessToken,
    };
  }
}
