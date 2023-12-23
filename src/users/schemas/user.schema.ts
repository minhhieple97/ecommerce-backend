import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from 'bcrypt';
export type UserDocument = User & Document;
const SALT_ROUNDS = 10;
@Schema()
export class User {
  @Prop({})
  userId: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  age: number;

  @Prop([String])
  favoriteFoods: string[];

  @Prop()
  salt: string;

  @Prop({ required: true })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<User>('save', function (next: Function) {
  const user = this;
  if (user.password) {
    bcrypt.genSalt(SALT_ROUNDS, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.salt = salt;
        user.password = hash;
        next();
      });
    })
  }
});