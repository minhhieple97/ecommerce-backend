import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { SignUpDto } from 'src/auth/dtos/auth.dto';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
  async createUser(signUpDto: SignUpDto): Promise<UserDocument> {
    const { email, password } = signUpDto;
    return this.create({ email, password });
  }
  async setCurrentRefreshToken(
    userId: string,
    hashedToken: string,
  ): Promise<void> {
    await this.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { refreshToken: hashedToken },
    );
  }
}
