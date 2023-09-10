import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MealSchema } from './schema/meal.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Meal', schema: MealSchema }]),
    RestaurantModule,
  ],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
