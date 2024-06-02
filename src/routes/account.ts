import { Router } from 'express';
import { createAccount } from '../controllers/accounts.controller';
import {
  getAccountBalance,
  blockAccount,
  activateAccount
} from '../controllers/accounts.controller';
import isShowBalanceTodayBelowLimit from '../middlewares/isShowBalanceTodayBelowLimit.middleware';

const accountRouter = Router();

accountRouter.post('/create/:userId', createAccount);

accountRouter.get('/:accountId/balance', isShowBalanceTodayBelowLimit, getAccountBalance);
accountRouter.post('/:accountId/block', blockAccount); // ! implement
accountRouter.post('/:accountId/activate', activateAccount);

export default accountRouter;
