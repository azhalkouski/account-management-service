import { getCORSWhiteList } from '../utils';

const corsWhiteList = getCORSWhiteList();

const corsOptions = {
  // @ts-ignore
  origin: function (origin, callback) {
    console.log('origin', origin)
    // * add `|| !origin` if you want to allow server-to-server communication
    if (corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



export default corsOptions;
