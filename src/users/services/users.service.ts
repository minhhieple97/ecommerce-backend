import { SignUpDto } from 'src/auth/dtos/auth.dto';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(userId: string): Promise<User> {
    return await this.usersRepository.findOne({
      _id: new Types.ObjectId(userId),
    });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  getUserByConditional(conditional: any): Promise<UserDocument> {
    return this.usersRepository.findOne(conditional);
  }

  async createUser(signUpDto: SignUpDto): Promise<UserDocument> {
    const { email, password } = signUpDto;
    return this.usersRepository.create({
      password,
      email,
      favoriteFoods: [],
    });
  }

  async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
  }

  async setCurrentRefreshToken(
    userId: string,
    hashedToken: string,
  ): Promise<void> {
    await this.usersRepository.setCurrentRefreshToken(userId, hashedToken);
  }

  async getUserWithRole(userId: string, role: string) {
    return this.usersRepository.findOne({
      _id: new Types.ObjectId(userId),
      roles: { $in: [role] },
    });
  }
}
