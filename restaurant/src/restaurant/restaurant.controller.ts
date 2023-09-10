import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schema/user.schema';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() currentUser: User,
  ): Promise<Restaurant> {
    return this.restaurantService.create(createRestaurantDto, currentUser);
  }

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return await this.restaurantService.findAll(query);
  }

  @Get(':id')
  async getRestaurant(@Param('id') id: string) {
    return await this.restaurantService.findById(id);
  }

  @Patch(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return await this.restaurantService.updateById(id, updateRestaurantDto);
  }

  @Delete(':id')
  async deleteRestaurant(@Param('id') id: string): Promise<{
    deleted: boolean;
  }> {
    const restaurant = await this.restaurantService.findById(id);
    const isDeleted = await this.restaurantService.deleteImages(
      restaurant.images,
    );
    if (isDeleted) {
      this.restaurantService.deleteById(id);
      return { deleted: true };
    } else {
      return { deleted: false };
    }
  }

  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.restaurantService.uploadFiles(id, files);
  }
}
