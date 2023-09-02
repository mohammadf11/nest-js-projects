import { CategoryEntity } from 'src/category/entities/category.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
  ManyToOne,
} from 'typeorm';

export enum ArticleStatus {
  DRAFT = 'draft',
  LOCK = 'lock',
  BACK = 'back',
  PUBLISH = 'publish',
}

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  headerImage: string;

  @Column({ default: '', nullable: true })
  body: string;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status: ArticleStatus;

  @Column({ default: 0 })
  likes: number;

  @ManyToOne(() => UserEntity, (user) => user.articlesLike)
  likedBy: UserEntity;

  @Column({ nullable: true })
  publishedDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.editArticles)
  editBy: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.articles)
  category: CategoryEntity;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;
}
