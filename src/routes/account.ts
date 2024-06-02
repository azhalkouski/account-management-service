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

accountRouter.get('/:id/balance', checkIfCanReqBalanceToday, getAccountBalance);
accountRouter.post('/:id/block', blockAccount);
accountRouter.post('/:id/activate', activateAccount);

export default accountRouter;
