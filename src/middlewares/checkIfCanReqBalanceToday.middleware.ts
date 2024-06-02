import { Request, Response, NextFunction } from 'express-serve-static-core';

// ! 10
// const BALANCE_LOOKUP_DAILY_LIMIT = process.env.BALANCE_LOOKUP_DAILY_LIMIT;

const checkIfCanReqBalanceToday = (req: Request, res: Response, next: NextFunction) => {
  // TODO: implement
  // TODO: fs.readFileSync
  // const count: number = userActivityTracker.getBalanceShownCountForUser(userId);

  // if (count >= BALANCE_LOOKUP_DAILY_LIMIT) {
  //   return res.sendStatus(403);
  // }

  next();
};

export default checkIfCanReqBalanceToday;
