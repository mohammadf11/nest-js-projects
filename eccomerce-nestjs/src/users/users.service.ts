import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async singup(UserSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(UserSignUpDto.email);
    if (userExists) throw new BadRequestException('این ایمیل قبلا وجود دارد ');
    UserSignUpDto.password = await hash(UserSignUpDto.password, 10);
    let user = this.userRepository.create(UserSignUpDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(UserSignInDto: UserSignInDto) {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: UserSignInDto.email })
      .getOne();
    if (!userExists)
      throw new BadRequestException('رمز عبور یا ایمیل درست نمی باشد');
    const matchPassword = await compare(
      UserSignInDto.password,
      userExists.password,
    );
    if (!matchPassword)
      throw new BadRequestException('رمز عبور یا ایمیل درست نمی باشد');

    delete userExists.password;
    return userExists;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRED_TIME },
    );
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('کابر با چنین ایدی وجود ندارد');
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: number) {
    const user = await this.userRepository.delete({ id });
    if (!user) throw new NotFoundException('کابر با چنین ایدی وجود ندارد');
    return user;
  }
}
