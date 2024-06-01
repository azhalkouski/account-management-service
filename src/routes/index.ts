import { Router } from 'express';
import { getUsers } from '../controllers/users.controller';
import accountRouter from './account';
import authRouter from './auth';

const router = Router();

router.use('/auth', authRouter);
router.use('/account', accountRouter);

router.get('/users', getUsers);


export default router;
