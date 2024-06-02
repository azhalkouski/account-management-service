import { Request, Response, NextFunction } from 'express-serve-static-core';
import {
  getTimesBalanceShownToUserToday
} from '../services/functionalLimitsTracker.service';
import { BALANCE_LOOKUP_DAILY_LIMIT } from '../constants'


const isShowBalanceTodayBelowLimit = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { accountId } } = req;

    const parsedAccountId = parseInt(accountId);
    const times = getTimesBalanceShownToUserToday(parsedAccountId);

    if (times >= BALANCE_LOOKUP_DAILY_LIMIT) {
      console.log(`Exceeded daily limit of showAccountBalance for accountId=${accountId}`)
      return res.sendStatus(403);
    }

  } catch (e) {
    // TODO: winston log
    console.error(`System error while getTimesBalanceShownToUserToday`, e);
  }

  // next() anyways. it is our fault that getTimesBalanceShownToUserToday failed
  // let user see thier balance
  next();
};

export default isShowBalanceTodayBelowLimit;
