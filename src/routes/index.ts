import { Router } from 'express';
import { getUsers, createUser } from '../controllers/users.controller'; // so... are these controllers? and then a controller uses services?
import { authenticateUser } from '../controllers/auth.controller';

const router = Router();


router.get('/users', getUsers);
router.post('/users', createUser);

router.post('/auth', authenticateUser);

export default router;
