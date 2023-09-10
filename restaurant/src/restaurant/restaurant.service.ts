import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Location, Restaurant } from './schemas/restaurant.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: mongoose.Model<Restaurant>,
  ) {}
  async create(
    createRestaurantDto: CreateRestaurantDto,
    currentUser: User,
  ): Promise<Restaurant> {
    const location: Location = { city: 'Tehran' };
    const restaurant = Object.assign(createRestaurantDto, {
      user: currentUser._id,
      location,
    });
    return await this.restaurantModel.create(restaurant);
  }

  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = 4;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return restaurants;
  }

  async findById(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) throw new BadRequestException('Wrong ID');
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException();
    return restaurant;
  }

  async updateById(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    await this.findById(id);
    return this.restaurantModel.findByIdAndUpdate(id, updateRestaurantDto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Restaurant> {
    await this.findById(id);
    return await this.restaurantModel.findByIdAndDelete(id);
  }

  async uploadFiles(id: string, files: Array<Express.Multer.File>) {
    const restaurant = await this.findById(id);
    const images = await APIFeatures.uploadImages(files);
    images.map((img) => restaurant.images.push(img));
    return await this.updateById(id, restaurant);
  }

  async deleteImages(images): Promise<boolean> {
    return await APIFeatures.deleteImages(images);
  }
}
