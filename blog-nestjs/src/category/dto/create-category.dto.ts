import { IsNotEmpty, IsString, Matches, IsBoolean } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty({ message: 'نام دسته بندی الزامیست' })
  @IsString({ message: 'نام دسته بندی الزامیست' })
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsString()
  image?: string;

  @IsBoolean()
  isActive: boolean;
}
