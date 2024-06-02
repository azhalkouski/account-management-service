import { Router } from 'express';
import { createAccount } from '../controllers/accounts.controller';
import {
  getAccountBalance,
  blockAccount,
  activateAccount
} from '../controllers/accounts.controller';
import checkIfCanReqBalanceToday from '../middlewares/checkIfCanReqBalanceToday.middleware';

const accountRouter = Router();

accountRouter.post('/create/:userId', createAccount);

accountRouter.get('/:accountId/balance', checkIfCanReqBalanceToday, getAccountBalance);
accountRouter.post('/:accountId/block', blockAccount);
accountRouter.post('/:accountId/activate', activateAccount);

export default accountRouter;
