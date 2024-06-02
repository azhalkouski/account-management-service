-- create a function on the databese
CREATE FUNCTION enforce_blocked_account_constraint()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.active = false AND (
    NEW.balance IS DISTINCT FROM OLD.balance OR
    NEW.daily_withdrawal_limit IS DISTINCT FROM OLD.daily_withdrawal_limit
  ) THEN
    RAISE EXCEPTION 'Update not allowed on blocked account';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- create a trigger on "Account" table
CREATE TRIGGER check_blocked_account
BEFORE UPDATE ON "Account"
FOR EACH ROW
EXECUTE FUNCTION enforce_blocked_account_constraint();