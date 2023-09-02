import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.findByName(createCategoryDto.name);
    if (categoryExists) throw new BadRequestException('category already exist');
    const category = this.categoryRepository.create(createCategoryDto);
    category.slug = slugify(category.name);
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findById(id: number) {
    return await this.categoryRepository.findOneBy({ id });
  }

  async findByIdAndCheckExit(id: number) {
    const categoryExist = await this.categoryRepository.findOneBy({ id });
    if (!categoryExist) throw new NotFoundException('category not found');
    return categoryExist;
  }

  async findByName(name: string) {
    const categoryExist = await this.categoryRepository.findOneBy({ name });
    if (!categoryExist) throw new NotFoundException('category not found');
    return categoryExist;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findByIdAndCheckExit(id);
    category.slug = updateCategoryDto.slug
      ? updateCategoryDto.slug
      : slugify(updateCategoryDto.name);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
