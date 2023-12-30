import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { FilterQuery, Model, MongooseError } from "mongoose";
import { EntityRepository } from "src/database/entity.repository";
import { SignUpDto } from "src/auth/dtos/auth.dto";

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
  async createUser(createUserDto: SignUpDto): Promise<UserDocument> {
    const { username, email, password } = createUserDto;
    const user = await this.create({ username, email, password });
    return user
  }
}
