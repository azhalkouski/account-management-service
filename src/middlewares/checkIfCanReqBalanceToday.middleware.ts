import { Request, Response, NextFunction } from 'express-serve-static-core';
import {
  getTimesBalanceShownToUserToday
} from '../services/userActivityTracker.service';
import { BALANCE_LOOKUP_DAILY_LIMIT } from '../constants'


const checkIfCanReqBalanceToday = (req: Request, res: Response, next: NextFunction) => {
  const { params: { accountId } } = req;

  const parsedAccountId = parseInt(accountId);
  const times = getTimesBalanceShownToUserToday(parsedAccountId);

  if (times >= BALANCE_LOOKUP_DAILY_LIMIT) {
    console.log(`Exceeded daily limit of showAccountBalance for accountId=${accountId}`)
    return res.sendStatus(403);
  }

  next();
};

// TODO: rename to isShowBalanceTodayBelowLimit
export default checkIfCanReqBalanceToday;
