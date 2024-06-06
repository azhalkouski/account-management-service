import { Request, Response, NextFunction } from 'express-serve-static-core';
import * as usersService from '../services/users.service';
import { getJWTSecret, hashPassword } from '../utils';
import { CreateUserT } from '../types/index';
import {
  UNIQUE_CONSTRAINT_FAILED,
  PRISMA_VALIDATION_ERROR
} from '../constants';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: add zod validation middleware
  // ! YES, it is zod validation because data comes from req.body
  const { body: { email, password } } = req;

  try {
    // TODO: integration test: call this route and make sure that 400 sent on bad request body
    const isMatch: boolean = await usersService.isUserCredentialsMatch(email, password);

    if (!isMatch) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({email: email}, getJWTSecret(), { expiresIn: '5m' });
    res.status(200).json({
      jwt: `Bearer ${token}`
    });
  } catch (e) {
    logger.error(`Sign in failed for user with email ${email} with error: ${e}`);
    res.sendStatus(500);
  }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
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
    logger.error(`Signup with email: ${email} failed due to error: ${e}`);

    if (
      e instanceof Error && e.message === UNIQUE_CONSTRAINT_FAILED ||
      e instanceof Error && e.message === PRISMA_VALIDATION_ERROR
    ) {
      res.sendStatus(400);
    }

    // in case of PRISMA_CLIENT_INITIALIZATION_ERROR or anything else
    res.sendStatus(500);
  }
};
