import { Request, Response, NextFunction } from 'express-serve-static-core';
import { findUserByEmailAndPassword, UserShortcutT } from '../services/users.service';
import { getJWTSecret } from '../utils';
import jwt from 'jsonwebtoken';

/**
 * Checks if email and password match
 * Generates JWT and returns it within response
 * 
 * The client later will need to include an Authorization header in your request with
 * the scheme set to bearer.
 */


export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body: { email, password } } = req;

    const user: UserShortcutT | null = await findUserByEmailAndPassword(email, password);

    if (!user) {
      return res.sendStatus(401);
    }

    const token = jwt.sign(user, getJWTSecret(), { expiresIn: '5m' });

    res.status(200).json({
      jwt: `Bearer ${token}`
    });
  } catch (e) {
    // TODO: winston.log(e)
    // TODO: next(e)
    console.error(e);
    res.sendStatus(500);
  }
}
