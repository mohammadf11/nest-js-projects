import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';
import APIFeatures from 'src/utils/apiFeatures.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto): Promise<string> {
    const user = await this.findByEmail(signupDto.email);
    if (user) throw new BadRequestException('email already exist');
    signupDto.password = await bcrypt.hash(signupDto.password, 10);
    await this.userModel.create(signupDto);
    const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);
    return token;
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException();
    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatched) throw new UnauthorizedException();

    const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

    return token;
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).select('+password');
    return user;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
