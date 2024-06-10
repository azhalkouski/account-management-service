import { Request, Response, NextFunction } from 'express-serve-static-core';
import zod from 'zod';

const validateUserIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { params: { userId } } = req;

  const { error: userIdError } = zod.number().safeParse(userId);

  if (userIdError !== undefined) {
    // throw new ValidationException();
    throw new Error();
  }

  next();
}

export default validateUserIdParam;
