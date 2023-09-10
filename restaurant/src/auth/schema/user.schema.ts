import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRoles {
  ADMIN = 'admin',
  User = 'user',
}
@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({
    enum: UserRoles,
    default: UserRoles.User,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
