import { Router } from 'express';
import { getUsers, createUser } from './users'; // so... are these controllers? and then a controller uses services?
import { authenticateUser } from './auth';

const router = Router();


router.get('/users', getUsers);
router.post('/users', createUser);

router.post('/auth', authenticateUser);

export default router;
