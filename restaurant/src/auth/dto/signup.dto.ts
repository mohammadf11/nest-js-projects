import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class SignupDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
