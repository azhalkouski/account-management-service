import { Router } from 'express';
import { createAccount } from '../controllers/accounts.controller';

const accountRouter = Router();

accountRouter.post('/create/:userId', createAccount);

export default accountRouter;
