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

export const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("Missing JWT secret");
    process.exit(1);
  };

  return secret;
};

export const getWorkingDataDirPath = () => {
  const workingDataDir = process.env.WORKING_DATA_DIR;

  if (!workingDataDir) {
    console.error("Missing WORKING_DATA_DIR");
    process.exit(1);
  };

  return workingDataDir;
};