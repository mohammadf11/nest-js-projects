import { IsNotEmpty, IsString } from 'class-validator';
import { SignInUserDto } from './signin_user.dto';

export class SignUpUserDto extends SignInUserDto {
  @IsNotEmpty({ message: 'نام الزامیست' })
  @IsString({ message: 'نام باید رشته باشد' })
  name: string;
}
