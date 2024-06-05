import winston from 'winston';
import { getLoggerLevel } from '../utils/index';

const logger = winston.createLogger({
  level: getLoggerLevel(),
  format: winston.format.json(),
  defaultMeta: { service: 'account-management-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// if we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}

export default logger;
