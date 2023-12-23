import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

export type ShopDocument = Shop & Document;

@Schema()
export class Shop {
  @Prop({
    trim: true,
    maxlength: 150
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true
  })
  password: string;

  @Prop({
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  })
  status: string;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false
  })
  verify: boolean;

  @Prop({
    type: SchemaTypes.Array,
    default: []
  })
  roles: string[];

}

export const ShopSchema = SchemaFactory.createForClass(Shop);