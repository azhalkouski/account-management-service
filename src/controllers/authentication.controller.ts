import { Request, Response, NextFunction } from 'express-serve-static-core';
import { PrismaClient, Prisma } from '@prisma/client';
import * as usersService from '../services/users.service';
import { getJWTSecret, hashPassword } from '../utils';
import { CreateUserT, PublicUser, UserShortcutT } from '../types/index';
import {
  EMAIL_IN_USE,
  CREATE_USER_ERROR_TYPE,
  USER_DOCUMENT_IN_USE
} from '../constants';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';


/**
 * Checks if email and password match
 * Generates JWT and returns it within response
 * 
 * The client later will need to include an Authorization header in requests with
 * the scheme set to bearer.
 */


export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: add zod validation middleware
  // ! YES, it is zod validation because data comes from req.body
  const { body: { email, password } } = req;

  try {
    // TODO: integration test: call this route and make sure that 400 sent on bad request body
    const user: UserShortcutT | null = await usersService.findUserByEmailAndPassword(email, password);

    if (!user) {
      return res.sendStatus(401);
    }

    const token = jwt.sign(user, getJWTSecret(), { expiresIn: '5m' });

    res.status(200).json({
      jwt: `Bearer ${token}`
    });
  } catch (e) {
    logger.error(`Sign in failed for user with email ${email} with error ${e}`);
    res.sendStatus(500);
  }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();
  // TODO: add validation: fullName, document, birthDate
  // ! YES, it is zod validation
  const {
    body: {
      email,
      password,
      fullName = "Human",
      document = (Math.round(Math.random() * 100000000)).toString(),
      birthDate =  new Date(1995, 3, 21)
    }
  } = req;

  try {
    const user: PublicUser | null = await usersService.findUserByEmail(email);

    if (user) {
      logger.warn(`Attempt to sign up with existing email ${email}.`);
      return res.status(400).json({
        type: CREATE_USER_ERROR_TYPE,
        message: {
          email: EMAIL_IN_USE
        }
      });
    }

    const newUser: CreateUserT = {
      email: email,
      password: hashPassword(password),
      name: fullName,
      document: document,
      birth_date: birthDate
    };

    const userId: number = await usersService.createUser(newUser);

    res.status(201).json({
      userId: userId
    });

  } catch (e) {
    logger.error(`Signup failed for valid email and password. email: ${email}`);

    if (isPrismaClientKnownRequestError(e) && e.code === 'P2002') {
      handlePrismaClientKnownRequestError(e, res);
    }

    res.sendStatus(500);
  } finally {
    await prisma.$disconnect();
  }
};

// ==========================================
// --------------Prisma Errors---------------
// ==========================================
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

// меня очень  сильно смущает эта функция: где она, и то, что она имеет доступ к res
function handlePrismaClientKnownRequestError(e: Prisma.PrismaClientKnownRequestError, res: Response) {
  const modelName = e.meta?.modelName;
      const modelTarget = Array.isArray(e.meta?.target) ? e.meta?.target : [];

      if (e.meta?.target && !Array.isArray(e.meta?.target)) {
        // log in case it is not an array due to lack of static type defined on
        // Prisma Client
        logger.warn(`Target is not array but ${JSON.stringify(e.meta?.target)}.
        Might need to work with types on Prisma`);
      }

      if (modelTarget.includes('document')) {
        logger.warn(`An attempt to create user with duplicate document.
        A user document expected to be unique per user.
        Might be the same person trying to create second account.`)
        return res.status(400).json({
          type: CREATE_USER_ERROR_TYPE,
          message: {
            email: USER_DOCUMENT_IN_USE
          }
        });
      } else {
        logger.error(`Error on POST /users - modelName: ${modelName} -
        target field: ${modelTarget}. Review database User model and its
        unique fields.`);
      }

      return res.sendStatus(400);
}
