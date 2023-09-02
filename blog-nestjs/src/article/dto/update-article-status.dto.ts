import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class UpdateArticleStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([
    ArticleStatus.BACK,
    ArticleStatus.DRAFT,
    ArticleStatus.LOCK,
    ArticleStatus.PUBLISH,
  ])
  status: ArticleStatus;
}
