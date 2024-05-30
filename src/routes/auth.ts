import { Router } from 'express';
import { signIn } from '../controllers/authentication.controller';
import validateCredentials from '../middlewares/validateCredentials.middleware';

const authRouter = Router();

authRouter.post('/signin', validateCredentials, signIn);

export default authRouter;
