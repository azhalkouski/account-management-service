import { Request, Response, NextFunction } from 'express-serve-static-core';
import { authenticate } from '../services/authentication.service';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body: { email, password } } = req;

    const isAuthenticated: boolean = await authenticate(email, password);

    if (!isAuthenticated) {
      return res.sendStatus(401);
    }

    res.sendStatus(200);
  } catch (e) {
    // TODO: winston.log(e)
    // TODO: next(e)
    console.error(e);
    res.sendStatus(500);
  }
}
