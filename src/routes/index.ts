import { Router } from 'express';
import { getUsers } from '../controllers/users.controller'; // so... are these controllers? and then a controller uses services?
import authRouter from './auth';

const router = Router();

router.use('/auth', authRouter);
router.get('/users', getUsers);


export default router;
