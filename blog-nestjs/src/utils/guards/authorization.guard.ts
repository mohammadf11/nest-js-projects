import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const result = request?.currentUser?.roles
        .map((role: string) => allowedRoles.includes(role))
        .find((val: boolean) => val === true);
      if (result) return true;
      throw new ForbiddenException('Sorry, you are not authorized.');
    }
  }
  return mixin(RolesGuardMixin);
};
