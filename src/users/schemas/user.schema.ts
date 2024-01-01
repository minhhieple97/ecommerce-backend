import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ROLES, SALT_ROUNDS } from 'src/configs/constants';
export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop([String])
  favoriteFoods: string[];

  @Prop()
  salt: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  })
  status: string;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
  })
  verify: boolean;

  @Prop({
    type: SchemaTypes.Array,
    default: [ROLES.SHOP],
  })
  roles: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<User>('save', function (next) {
  if (this.password) {
    bcrypt.genSalt(SALT_ROUNDS, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.salt = salt;
        this.password = hash;
        next();
      });
    });
  }
  next();
});
