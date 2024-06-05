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

    next();
  } catch (e) {
    console.error(`System error while getTimesBalanceShownToUserToday.
    Most likely fs module interaction`, e);

    // next() anyways. it is our fault that getTimesBalanceShownToUserToday failed
    // let user see thier balance
    next();
  }
};

export default isShowBalanceTodayBelowLimit;
