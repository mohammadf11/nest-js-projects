import { ArticleEntity } from 'src/article/entities/article.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;

  @OneToMany(() => ArticleEntity, (article) => article.category)
  articles: ArticleEntity;
}
