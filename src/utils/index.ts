import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain: string, hashed: string) => {
  return bcrypt.compareSync(plain, hashed);
};

export const getJWTSecret = () => (_extractEnvVarWithPocessExit('JWT_SECRET'));
export const getWorkingDataDirPath =() => ( _extractEnvVarWithPocessExit('WORKING_DATA_DIR'));
export const getCORSWhiteList = () => (_extractEnvVarWithPocessExit('CORS_WHITE_LIST'));
export const getLoggerLevel = () => (_extractEnvVarWithPocessExit('LOGGER_LEVEL'));


//
// PRIVATE
//
function _extractEnvVarWithPocessExit(envVarName: string) {
  const envVar = process.env[envVarName];

  if (!envVar) {
    console.error(`Missing ${envVarName}`);
    process.exit(1);
  };

  return envVar;
}
