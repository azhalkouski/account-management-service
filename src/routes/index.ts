import { Router } from 'express';

import accountRouter from './account';
import authRouter from './auth';
import paymentRouter from './payment';
import usersRouter from './users';

const router = Router();

router.use('/auth', authRouter);
router.use('/account', accountRouter);
router.use('/payment', paymentRouter);
router.use('/users', usersRouter);


export default router;
