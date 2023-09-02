import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Timestamp,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;
  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
