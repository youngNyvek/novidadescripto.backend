import { createHmac } from 'crypto';
import { NextFunction, Request, Response } from 'express';

const message = 'Unauthorized';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json(message);
  }

  const hmacReceived = createHmac('sha256', process.env.PRIVATE_KEY as string)
    .update(token)
    .digest('base64url');

  const hmacExpected = createHmac('sha256', process.env.PRIVATE_KEY as string)
    .update(process.env.PUBLIC_TOKEN)
    .digest('base64url');

  if (hmacReceived !== hmacExpected) {
    return res.status(401).json(message);
  }

  next();
};

export { verifyToken };
