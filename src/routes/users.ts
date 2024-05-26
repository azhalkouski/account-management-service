import { Request, Response } from "express-serve-static-core";
import { PrismaClient } from '@prisma/client';
import {
  EMAIL_IN_USE,
  CREATE_USER_ERROR_TYPE,
  EMAIL_NOT_VALID,
  PASSWORD_NOT_VALID
} from '../constants';
import { emailSchema, passwordSchema } from '../validation';
import { UserT } from '../types';
import { mockUsers } from '../mockData';


export const createUser = (req: Request, res: Response) => {
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

  // TODO: try/cache save to db and handle 400 if email is not unique
  const findUserIndexByEmail = mockUsers.findIndex(
    (user) => user.email === parsedEmail
  );

  if (findUserIndexByEmail >= 0) {
    return res.status(400).json({
      type: CREATE_USER_ERROR_TYPE,
      message: {
        email: EMAIL_IN_USE
      }
    });
  }

  const newUser: UserT = {
    id: mockUsers[mockUsers.length - 1].id + 1,
    email: parsedEmail,
    password: parsedPassword
  };

  mockUsers.push(newUser);
  res.sendStatus(201);
};

export const getUsers = (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  async function main() {
    const allUsers = await prisma.user.findMany();
    console.log(`allUsers: ${allUsers}`);
  }

  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    });

    res.status(200).send(mockUsers);
};
