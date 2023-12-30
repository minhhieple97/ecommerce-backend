import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto, SignInDto } from '../dtos/auth.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors/transform-response.interceptor';
import { MongoExceptionFilter } from 'src/common/filters/mongodb-exception.filter';

@Controller('auth')
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UseFilters(MongoExceptionFilter)
  signUp(@Body() createUserDto: SignUpDto) {
    return this.authService.signUp(createUserDto);
  }
}
