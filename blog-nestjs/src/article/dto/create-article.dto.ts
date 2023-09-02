import {
  IsString,
  IsNumber,
  Matches,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsString()
  @IsOptional()
  headerImage?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsNumber()
  @IsOptional()
  categoryId: number;
}
