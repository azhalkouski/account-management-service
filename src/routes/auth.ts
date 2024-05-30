import { Router } from 'express';
import { signIn, signUp } from '../controllers/authentication.controller';
import validateCredentials from '../middlewares/validateCredentials.middleware';

const authRouter = Router();

authRouter.post('/signin', validateCredentials, signIn);
authRouter.post('/signup', validateCredentials, signUp);

export default authRouter;
