import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createHmac } from 'crypto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly message = 'Unauthorized';

  use(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException(this.message);
    }

    const hmacReceived = createHmac('sha256', process.env.PRIVATE_KEY as string)
      .update(token)
      .digest('base64url');

    const hmacExpected = createHmac('sha256', process.env.PRIVATE_KEY as string)
      .update(process.env.PUBLIC_TOKEN)
      .digest('base64url');

    if (hmacReceived !== hmacExpected) {
      throw new UnauthorizedException(this.message);
    }

    next();
  }
}
