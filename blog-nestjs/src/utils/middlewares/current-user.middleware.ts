import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

declare module 'express' {
  interface Request {
    currentUser?: UserEntity;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = <JwtPayload>verify(token, process.env.JWT_SECRET);
        const currentUser = await this.usersService.findUserByID(+id);
        req.currentUser = currentUser;
        next();
      } catch (err) {
        req.currentUser = null;
        next();
      }
    }
  }
}
interface JwtPayload {
  id: string;
}
