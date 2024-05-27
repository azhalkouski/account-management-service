import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
}

export const comparePassword = (plain: string, hashed: string) => {
  return bcrypt.compareSync(plain, hashed);
}

export const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    console.error("Missing session secret")
    process.exit(1);
  };

  return secret;
}

export const getCookieMaxAge = () => {
  const maxAge = Number(process.env.COOKIE_MAX_AGE);

  if (isNaN(maxAge)) {
    console.error("COOKIE_MAX_AGE must a number.")
    process.exit(1);
  };

  return maxAge;
}