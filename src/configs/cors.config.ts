import { getCORSWhiteList } from '../utils';
import logger from '../utils/logger';

const corsWhiteList = getCORSWhiteList();

const corsOptions = {
  // @ts-ignore
  origin: function (origin, callback) {
    console.log('origin', origin)
    const predicate = process.env.NODE_ENV === 'production'
      ? corsWhiteList.indexOf(origin) !== -1
      : corsWhiteList.indexOf(origin) !== -1 || !origin;

      if (predicate) {
      logger.debug(`Request from untrusted origin ${origin} in ${process.env.NODE_ENV} environment.`);
      callback(null, true)
    } else {
      logger.warn(`Request from untrusted origin ${origin} in ${process.env.NODE_ENV} environment.`);
      callback(new Error('Not allowed by CORS'))
    }
  }
}


export default corsOptions;
