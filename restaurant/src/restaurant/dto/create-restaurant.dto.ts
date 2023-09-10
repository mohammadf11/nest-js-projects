import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsPhoneNumber('IR')
  readonly phoneNumber: number;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsEnum(Category)
  readonly category: Category;
}
