import { Request, Response, NextFunction } from 'express-serve-static-core';
import {
  EMAIL_NOT_VALID,
  PASSWORD_NOT_VALID
} from '../constants';
import { emailSchema, passwordSchema } from '../utils/validation';
import ValidationException from '../models/ValidationException';

const validateCredentials = (req: Request, res: Response, next: NextFunction) => {
  const { body: { email, password } } = req;

  const { error: emailError } = emailSchema.safeParse(email);
  const { error: passwordError } = passwordSchema.safeParse(password);

  if (emailError || passwordError) {
    throw new ValidationException(
      `${EMAIL_NOT_VALID} OR ${PASSWORD_NOT_VALID}`,
      null,
      null
    );
  }

  next();
};

export default validateCredentials;