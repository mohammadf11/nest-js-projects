import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { UserEntity, UserRole } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/utils/decorator/current-user.decorator';
import { UpdateArticleStatusDto } from './dto/update-article-status.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([UserRole.ADMIN, UserRole.AUTHOR]),
  )
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.articleService.create(createArticleDto, currentUser);
  }

  @Patch('update-status/:id')
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([UserRole.ADMIN, UserRole.AUTHOR]),
  )
  async updateStatusArticle(
    @Param('id') id: string,
    @Body() updateArticleStatusDto: UpdateArticleStatusDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.articleService.updateStatusArticle(
      +id,
      updateArticleStatusDto,
      currentUser,
    );
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([UserRole.ADMIN, UserRole.AUTHOR]),
  )
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.articleService.update(+id, updateArticleDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
