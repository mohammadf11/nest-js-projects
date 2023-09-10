import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Restaurant } from 'src/restaurant/schemas/restaurant.schema';

export enum Category {
  SOUPS = 'Soups',
  SALADS = 'Salads',
  SANDWICHES = 'Sandwiches',
  PASTA = 'Pasta',
}
@Schema({ timestamps: true })
export class Meal {
  @Prop()
  name: string;

  @Prop()
  desc: string;

  @Prop()
  price: string;

  @Prop()
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Restaurant;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
