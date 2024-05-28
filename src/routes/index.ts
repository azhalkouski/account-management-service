import { Router } from 'express';
import { getUsers, createUser } from '../controllers/users.controller'; // so... are these controllers? and then a controller uses services?
import { authenticateUser } from '../controllers/auth.controller';
import validateCredentials from '../middlewares/validateCredentials.middleware';

const router = Router();


router.get('/users', getUsers);
router.post('/users', createUser);

router.post('/auth', validateCredentials, authenticateUser);

export default router;
