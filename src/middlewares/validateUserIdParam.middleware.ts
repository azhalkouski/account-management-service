import { Request, Response, NextFunction } from 'express-serve-static-core';
import zod from 'zod';
import ValidationException from '../models/ValidationException';

const INVALID_USER_ID_PARAM = 'Invalid userId in req.params';

const validateUserIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { params: { userId } } = req;

  const { error: userIdError } = zod.number().safeParse(userId);

  if (userIdError !== undefined) {
    throw new ValidationException(INVALID_USER_ID_PARAM, null, null);
  }

  next();
}

export default validateUserIdParam;
