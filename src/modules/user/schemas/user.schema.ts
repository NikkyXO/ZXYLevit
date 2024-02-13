import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema()
export class User {
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  address?: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: true })
  paid: boolean;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ enum: UserGender })
  gender?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// inside the class definition
// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
// owner: Owner
