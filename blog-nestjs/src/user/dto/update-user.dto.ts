import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'نام الزامیست' })
  @IsString({ message: 'نام باید رشته باشد' })
  name: string;
}
