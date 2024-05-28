import { Request, Response } from 'express-serve-static-core';
import { PrismaClient } from '@prisma/client';
import {
  CREATE_USER_ERROR_TYPE,
  EMAIL_NOT_VALID,
  PASSWORD_NOT_VALID
} from '../constants';
import { emailSchema, passwordSchema } from '../validation';
import { UserT } from '../types';
import { comparePassword } from '../utils';


export const authenticateUser = async (req: Request, res: Response) => {
  const { body: { email, password } } = req;
  const prisma = new PrismaClient();

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
    const user: UserT | null = await prisma.user.findFirst({
      where: {
        email: parsedEmail,
      },
    });

    if (!user) {
      return res.sendStatus(401);
    }

    const isPasswordMatch = comparePassword(parsedPassword, user.password);
    if (!isPasswordMatch) {
      return res.sendStatus(401);
    }

    // @ts-ignore
    // what is the way to handle ts error here?
    req.session.userIsAuthenticated = true;
    res.sendStatus(200);

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}