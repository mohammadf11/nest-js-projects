import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty({ message: 'ایمیل الزامیست' })
  @IsString({ message: 'ایمیل باید رشته باشد' })
  @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
  email: string;

  @IsNotEmpty({ message: 'پسورد الزامیست' })
  @IsString({ message: 'پسورد باید رشته باشد' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'پسورد ضعیف است',
  })
  password: string;
}
