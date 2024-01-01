import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersService } from 'src/users/services/users.service';
import { JwtAccessTokenGuard } from 'src/auth/guards/jwt-access-token.guard';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { TransformResponseInterceptor } from 'src/common/interceptors/transform-response.interceptor';

@Controller('users')
@UseInterceptors(TransformResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current-user')
  @UseGuards(JwtAccessTokenGuard)
  async getUser(@Req() request: RequestWithUser) {
    const { email, _id, status, roles, favoriteFoods } = request.user;
    return {
      _id: _id.toString(),
      email,
      status,
      favoriteFoods,
      roles,
    };
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
