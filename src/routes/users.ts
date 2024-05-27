import { Request, Response } from "express-serve-static-core";
import { PrismaClient, Prisma } from '@prisma/client';
import { hashPassword } from '../utils';
import {
  EMAIL_IN_USE,
  CREATE_USER_ERROR_TYPE,
  EMAIL_NOT_VALID,
  PASSWORD_NOT_VALID
} from '../constants';
import { emailSchema, passwordSchema } from '../validation';
import { CreateUserT, UserT } from '../types';

function isPrismaClientKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'clientVersion' in error
  );
}


export const createUser = async (req: Request, res: Response) => {
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
        email: email,
      },
    });

    if (user) {
      console.log('User with email already exists:', user);
      return res.status(400).json({
        type: CREATE_USER_ERROR_TYPE,
        message: {
          email: EMAIL_IN_USE
        }
      });
    }

    const newUser: CreateUserT = {
      email: parsedEmail,
      password: hashPassword(parsedPassword),
      name: 'Human',
      document: 'djkshgskljgh',
      birth_date: new Date(1995, 3, 21)
    };

    await prisma.user.create({ data: newUser });
    res.sendStatus(201);
  } catch (e) {
    console.error(e)
    if (isPrismaClientKnownRequestError(e) && e.code === 'P2002') {
      // throws when DOCUMENT_IN_USE
      // TODO: dynamic err msg for broken constraints besids `email`
      return res.sendStatus(400);
    }

    res.sendStatus(500);
  } finally {
    await prisma.$disconnect()
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  try {
    const allUsers: UserT[] = await prisma.user.findMany();
    res.status(200).send(allUsers);
    await prisma.$disconnect()
  } catch (e) {
    console.error(e)
    await prisma.$disconnect()
    res.sendStatus(500);
  }
};
