import { Router } from 'express';
import { createAccount } from '../controllers/accounts.controller';
import {
  activateAccount,
  blockAccount,
  depositAmount,
  getAccountBalance,
  getAccountTransactions,
  withdrawAmount
} from '../controllers/accounts.controller';
import isShowBalanceTodayBelowLimit from '../middlewares/isShowBalanceTodayBelowLimit.middleware';
import validateAccountTypeQuery from '../middlewares/validateAccountTypeQuery.middleware';
import validateUserIdParam from '../middlewares/validateUserIdParam.middleware';

const accountRouter = Router();

accountRouter.post('/create/:userId', validateUserIdParam, validateAccountTypeQuery, createAccount);

accountRouter.get('/:accountId/balance', isShowBalanceTodayBelowLimit, getAccountBalance);
accountRouter.post('/:accountId/deposit', depositAmount);
accountRouter.post('/:accountId/withdraw', withdrawAmount);
accountRouter.get('/:accountId/transactions', getAccountTransactions);
accountRouter.post('/:accountId/block', blockAccount);
accountRouter.post('/:accountId/activate', activateAccount);

export default accountRouter;
