import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { User } from 'src/auth/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schema/meal.schema';
import mongoose from 'mongoose';
import { Restaurant } from 'src/restaurant/schemas/restaurant.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name) private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  async create(createMealDto: CreateMealDto, user: User) {
    const data = Object.assign(createMealDto, { user: user._id });
    const meal = await this.mealModel.create(data);

    const restaurant = await this.restaurantModel.findById(
      createMealDto.restaurant,
    );

    if (!restaurant) throw new NotFoundException('restarant not found');

    restaurant.menu.push(meal);

    await restaurant.save();

    return meal;
  }

  findAll() {
    return `This action returns all meal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meal`;
  }

  update(id: number, updateMealDto: UpdateMealDto) {
    return `This action updates a #${id} meal`;
  }

  remove(id: number) {
    return `This action removes a #${id} meal`;
  }
}
