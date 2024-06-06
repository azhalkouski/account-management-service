import { Request, Response, NextFunction } from 'express-serve-static-core';
import {
  EMAIL_NOT_VALID,
  PASSWORD_NOT_VALID
} from '../constants';
import { emailSchema, passwordSchema } from '../models/validation';

const validateCredentials = (req: Request, res: Response, next: NextFunction) => {
  const { body: { email, password } } = req;

  const { error: emailError } = emailSchema.safeParse(email);
  const { error: passwordError } = passwordSchema.safeParse(password);

  if (emailError) {
    return res.status(400).json({
      massage: {
        email: EMAIL_NOT_VALID
      }
    });
  }

  if (passwordError) {
    return res.status(400).json({
      massage: {
        password: PASSWORD_NOT_VALID
      }
    });
  }

  next();
};

export default validateCredentials;