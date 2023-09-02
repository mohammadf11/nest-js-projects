import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UserEntity, UserRole } from './entities/user.entity';
import { SignInUserDto } from './dto/signin_user.dto';
import { Request, Response } from 'express';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';
import { CurrentUser } from 'src/utils/decorator/current-user.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signUpUserDto: SignUpUserDto): Promise<UserEntity> {
    return await this.userService.signup(signUpUserDto);
  }

  @Post('signin')
  async signin(
    @Body() signInUserDto: SignInUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    userInfo: {
      email: string;
      profileImage: string;
      name: string;
    };
    accessToken: Promise<string>;
  }> {
    return await this.userService.signin(signInUserDto, req, res);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.userService.logout(req, res);
  }

  @Post('refreshToken')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.getRefreshToken(req, res);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Get('all')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findUserByID(@Param('id') id: string) {
    return await this.userService.findUserByID(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.userService.updateUser(+id, updateUserDto, currentUser);
  }

  @Patch('update-roles/:id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userService.updateUserRole(+id, updateUserRoleDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  async softDelete(@Param('id') id: string) {
    return await this.userService.softDelete(+id);
  }
}
