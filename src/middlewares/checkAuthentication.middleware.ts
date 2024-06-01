import { Request, Response, NextFunction } from "express-serve-static-core";
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { getJWTSecret } from '../utils';

const strategyOptions = {
  secretOrKey: getJWTSecret(),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(new Strategy(strategyOptions, function(jwtPayload, done) {
  const user = {
    id: jwtPayload.id,
    email: jwtPayload.email,
  };

  done(null, user);
}));

const checkAuthenticationMiddleware = (whiteList: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestUrl = req.url;

  if (!whiteList.includes(requestUrl) && !req.isAuthenticated()) {
    console.log('AUTHENTICATION REQUIRED');

    passport.authenticate('jwt', { session: false })(req, res, next);

  } else {
    console.log('NO authentication required');
    next();
  }

};

export default checkAuthenticationMiddleware;