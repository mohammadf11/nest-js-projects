import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
