import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productsService: ProductsService,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    const product = await this.productsService.findOne(
      createReviewDto.productId,
    );
    let review = await this.findOneByUserAndProduct(
      currentUser.id,
      createReviewDto.productId,
    );
    if (!review) {
      review = this.reviewRepository.create(review);
      review.user = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }
    return await this.reviewRepository.save(review);
  }

  findAll() {
    return `This action returns all reviews`;
  }

  async findAllByProduct(productId: number): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: {
        user: true,
        product: { category: true },
      },
    });
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: { category: true },
      },
    });
    if (!review) throw new NotFoundException('review not found');
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    if (!review) throw new NotFoundException('review not found');
    return await this.reviewRepository.remove(review);
  }
  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepository.findOne({
      where: { product: { id: productId }, user: { id: userId } },
      relations: { user: true, product: { category: true } },
    });
  }
}
