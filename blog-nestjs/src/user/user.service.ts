import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin_user.dto';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import dataSource from 'db/data-source';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  //signup
  async signup(signUpUserDto: SignUpUserDto): Promise<UserEntity> {
    const foundUser = await this.findUserByEmail(signUpUserDto.email);
    if (foundUser) throw new BadRequestException('این ایمیل قبلا ثبت شده است');
    signUpUserDto.password = await hash(signUpUserDto.password, 10);
    let user = this.userRepository.create(signUpUserDto);
    user.refreshToken = [];
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  //signin
  async signin(
    signInUserDto: SignInUserDto,
    req: Request,
    res: Response,
  ): Promise<{
    userInfo: {
      email: string;
      profileImage: string;
      name: string;
    };
    accessToken: Promise<string>;
  }> {
    const foundUser = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: signInUserDto.email })
      .getOne();
    if (!foundUser) throw new UnauthorizedException('ایمیل و پسورد صحیح  نیست');
    const matchPassword = await compare(
      signInUserDto.password,
      foundUser.password,
    );
    if (!matchPassword)
      throw new UnauthorizedException('ایمیل و پسورد صحیح  نیست');

    const accessToken = await this.getAccessToken(foundUser, req, res);
    const userInfo = {
      email: foundUser.email,
      profileImage: foundUser.profileImage,
      name: foundUser.name,
    };
    return { userInfo, accessToken };
  }

  async getAccessToken(
    user: UserEntity,
    req: Request,
    res: Response,
  ): Promise<any> {
    const cookies = req.cookies;
    const accessToken = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const newRefreshToken = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });

    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await dataSource.getRepository(UserEntity).findOne({
        where: {
          refreshToken: Like(`%${refreshToken}%`),
        },
      });
      if (!foundToken) {
        newRefreshTokenArray = [];
      }
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }

    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

    await this.userRepository.save(user);
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });
    return await accessToken;
  }

  //refreshToken
  async getRefreshToken(req: Request, res: Response) {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw new UnauthorizedException('Unauthorized');
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    const foundUser = await dataSource.getRepository(UserEntity).findOne({
      where: {
        refreshToken: Like(`%${refreshToken}%`),
      },
    });

    if (!foundUser) {
      verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return;
        const hackedUser = await this.findUserByID(decoded.id);
        if (hackedUser) {
          hackedUser.refreshToken = [];
          await this.userRepository.save(hackedUser);
        }
      });

      throw new ForbiddenException('Forbidden');
    }

    const newRefreshTokenArray = foundUser.refreshToken?.filter(
      (rt) => rt !== refreshToken,
    );
    return verify(
      refreshToken,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          foundUser.refreshToken = [...newRefreshTokenArray];
          await this.userRepository.save(foundUser);
        }

        if (err || foundUser.id !== decoded.id)
          throw new UnauthorizedException('Unauthorized');

        const accessToken = sign({ id: decoded.id }, process.env.JWT_SECRET, {
          expiresIn: '5m',
        });

        const newRefreshToken = sign(
          { id: foundUser.id },
          process.env.JWT_SECRET,
          { expiresIn: '15d' },
        );

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await this.userRepository.save(foundUser);
        res.cookie('jwt', newRefreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 15,
        });
        const userInfo = {
          name: foundUser.name,
          profileImage: foundUser.profileImage,
        };
        return { accessToken, userInfo };
      },
    );
  }

  async logout(req: Request, res: Response) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const foundUser = await this.userRepository.findOneBy({ refreshToken });
    if (!foundUser) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken,
    );
    await this.userRepository.save(foundUser);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    throw new HttpException('logout successfully', 204);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findUserByID(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: UserEntity,
  ) {
    const user = await this.findUserByID(id);
    if (!user) throw new NotFoundException('ایدی موجود نیست');
    if (!(currentUser?.roles?.includes('admin') || currentUser.id === id))
      throw new ForbiddenException('شما دسترسی ندارید');
    user.name = updateUserDto.name;
    return await this.userRepository.save(user);
  }

  async updateUserRole(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.findUserByID(id);
    if (!user) throw new NotFoundException('ایدی موجود نیست');
    user.roles = updateUserRoleDto.roles;
    return await this.userRepository.save(user);
  }

  async softDelete(id: number) {
    const user = this.findUserByID(id);
    if (!user) throw new NotFoundException('ایدی موجود نیست');
    return await this.userRepository.softDelete(id);
  }
}
