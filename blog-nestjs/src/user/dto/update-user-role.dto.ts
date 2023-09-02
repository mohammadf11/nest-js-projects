import { IsIn, IsNotEmpty, IsArray } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsArray()
  @IsIn(
    [UserRole.ADMIN, UserRole.AUTHOR, UserRole.SPECIALUSER, UserRole.USER],
    { each: true },
  )
  roles: UserRole;
}
