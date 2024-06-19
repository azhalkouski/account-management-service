import { Request, Response, NextFunction } from 'express-serve-static-core';
import {
  getTimesBalanceShownToUserToday
} from '../services/functionalLimitsTracker.service';
import logger from '../utils/logger';
import { BALANCE_LOOKUP_DAILY_LIMIT } from '../constants'
import BaseException from '../models/BaseException';


const isShowBalanceTodayBelowLimit = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { accountId } } = req;

    const parsedAccountId = parseInt(accountId);
    const times = getTimesBalanceShownToUserToday(parsedAccountId);

    if (times >= BALANCE_LOOKUP_DAILY_LIMIT) {
      logger.info(`Exceeded daily limit of showAccountBalance for accountId=${accountId}`)
      throw new BaseException(`Exceeded daily limit of showAccountBalance for accountId=${accountId}`, null, null);
    }

    next();
  } catch (e) {
    console.error(`System error while getTimesBalanceShownToUserToday.
    Most likely fs module interaction`, e);

    next(e);
  }
};

export default isShowBalanceTodayBelowLimit;
