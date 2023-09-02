import { ArticleEntity } from 'src/article/entities/article.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Timestamp,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  SPECIALUSER = 'specialUser',
  AUTHOR = 'author',
  ADMIN = 'admin',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.author)
  editArticles: ArticleEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.likedBy)
  articlesLike: ArticleEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.addedBy)
  categories: CategoryEntity[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @CreateDateColumn()
  createAt: Timestamp;

  @UpdateDateColumn()
  updateAt: Timestamp;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column('simple-array')
  refreshToken: string[];
}
