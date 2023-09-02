import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CategoryService } from 'src/category/category.service';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, CategoryEntity])],
  controllers: [ArticleController],
  providers: [ArticleService, CategoryService],
})
export class ArticleModule {}
