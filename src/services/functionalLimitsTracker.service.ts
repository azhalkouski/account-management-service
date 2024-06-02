/**
 * - Manage files: create if not exist `balance_lookup_01-06-2024.txt`
 * - write to file
 * - read from file
 * 
 * `"userId": number`
 */

const store = new Map<number, number>();

export const getTimesBalanceShownToUserToday = (accountId: number) => {
  // TODO: apply fs module
  let currentCount = store.get(accountId);
  currentCount = currentCount === undefined ? 0 : currentCount;
  return currentCount;
};

export const incrementTimesBalanceShownToUserToday = (accountId: number) => {
  // TODO: apply fs module
  const currentCount = store.get(accountId);
  const nextCount = currentCount === undefined ? 1 : currentCount + 1;
  store.set(accountId, nextCount);
}