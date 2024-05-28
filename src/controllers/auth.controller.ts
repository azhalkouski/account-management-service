import { Request, Response, NextFunction } from 'express-serve-static-core';
import { authenticate } from '../services/authentication.service';
import {
  CREATE_USER_ERROR_TYPE,
  EMAIL_NOT_VALID,
  PASSWORD_NOT_VALID
} from '../constants';
import { emailSchema, passwordSchema } from '../validation';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { body: { email, password } } = req;

  const { error: emailError, data: parsedEmail } = emailSchema.safeParse(email);
  const { error: passwordError, data: parsedPassword } = passwordSchema.safeParse(password);

  if (emailError) {
    return res.status(400).json({
      type: CREATE_USER_ERROR_TYPE,
      massage: {
        email: EMAIL_NOT_VALID
      }
    });
  }

  if (passwordError) {
    return res.status(400).json({
      type: CREATE_USER_ERROR_TYPE,
      massage: {
        password: PASSWORD_NOT_VALID
      }
    });
  }

  try {
    // TODO: prior validate email and password and put them onto the req object
    // TODO: get parsedEmail and parsedPassowrd from req object
    // TODO: const { parsedEmail, parsedPassword } = req;
    const isAuthenticated: boolean = await authenticate(parsedEmail, parsedPassword);

    if (!isAuthenticated) {
      return res.sendStatus(401);
    }

    // @ts-ignore
    // what is the way to handle ts error here?
    req.session.userIsAuthenticated = true;
    res.sendStatus(200);
  } catch (e) {
    // TODO: winston.log(e)
    // TODO: next(e)
    console.error(e);
    res.sendStatus(500);
  }
}
