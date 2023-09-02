import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, ArticleStatus } from './entities/article.entity';
import { Repository } from 'typeorm';
import { UpdateArticleStatusDto } from './dto/update-article-status.dto';
import { UserEntity, UserRole } from 'src/user/entities/user.entity';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createArticleDto: CreateArticleDto, currentUser: UserEntity) {
    const article = this.articleRepository.create(createArticleDto);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  async updateStatusArticle(
    id: number,
    UpdateArticleStatusDto: UpdateArticleStatusDto,
    currentUser: UserEntity,
  ) {
    const adminActionStatus = [
      ArticleStatus.DRAFT,
      ArticleStatus.BACK,
      ArticleStatus.PUBLISH,
    ];

    const article = await this.findById(id);
    console.log(article);

    if (
      adminActionStatus.includes(UpdateArticleStatusDto.status) &&
      !currentUser.roles.includes('admin')
    )
      throw new ForbiddenException();

    if (
      UpdateArticleStatusDto.status == ArticleStatus.LOCK ||
      UpdateArticleStatusDto.status == ArticleStatus.PUBLISH
    ) {
      if (!article.title) throw new BadRequestException('title required');
      if (!article.slug) throw new BadRequestException('slug required');
      if (!article.body) throw new BadRequestException('body required');
      if (!article.category) throw new BadRequestException('category required');
      if (!article.headerImage)
        throw new BadRequestException('header image required');

      if (UpdateArticleStatusDto.status === ArticleStatus.PUBLISH)
        article.publishedDate = new Date();
    }
    article.status = UpdateArticleStatusDto.status;

    return await this.articleRepository.save(article);
  }

  findAll() {
    return this.articleRepository.find({
      relations: ['category', 'author'],
      select: {
        id: true,
        title: true,
        slug: true,
        body: true,
        status: true,
        category: {
          id: true,
          name: true,
        },
        author: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findById(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['category', 'author'],
      select: {
        author: {
          id: true,
        },
        category: {
          id: true,
          name: true,
        },
      },
    });
    if (!article) throw new NotFoundException('article not found');
    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    currentUser: UserEntity,
  ) {
    const article = await this.findById(id);

    if (!currentUser.roles.includes(UserRole.ADMIN)) {
      if (
        currentUser.id != article.author.id ||
        article.status != ArticleStatus.DRAFT
      )
        throw new ForbiddenException();
    }
    Object.assign(article, updateArticleDto);
    if (updateArticleDto.categoryId) {
      const category = await this.categoryService.findById(
        updateArticleDto.categoryId,
      );
      article.category = category;
    }
    //admin
    if (article.author.id != currentUser.id) article.editBy = currentUser;
    return await this.articleRepository.save(article);
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
