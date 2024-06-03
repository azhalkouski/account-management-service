import Decimal from "decimal.js"; 

export const makePayment = async (sourceAccountId: string, destinationAccountId: string, amount: number) => {
  console.log(sourceAccountId, destinationAccountId, amount);
  const a = new Decimal(0.7);
  const b = new Decimal(0.6);
  const c = a.add(b);
  console.log('c', c)

  // check if account 1 exists
  // check if account 2 exists
  // make transaction
}
