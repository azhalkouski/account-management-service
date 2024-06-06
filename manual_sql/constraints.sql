ALTER TABLE "Transaction"
ADD CONSTRAINT fk_transaction_from
FOREIGN KEY ("from") REFERENCES "Account"(id);

ALTER TABLE "Transaction"
ADD CONSTRAINT fk_transaction_to
FOREIGN KEY ("to") REFERENCES "Account"(id);