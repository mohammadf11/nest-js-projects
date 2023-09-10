import { Category } from '../schema/meal.schema';
import { IsString, IsNotEmpty,++ IsEnum, IsNumber } from 'class-validator';

export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly desc: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: string;

  @IsNotEmpty()
  @IsEnum(Category, {})
  readonly category: Category;

  @IsNotEmpty()
  @IsString()
  readonly restaurant: string;
}
