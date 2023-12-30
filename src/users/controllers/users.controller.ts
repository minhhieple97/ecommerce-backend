import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';


import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersService } from 'src/users/services/users.service';
import { ConfigService } from '@nestjs/config';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) { }

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }


  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}