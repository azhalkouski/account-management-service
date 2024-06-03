/*
  Warnings:

  - You are about to drop the column `account_id` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `from` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_account_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "account_id",
ADD COLUMN     "from" INTEGER NOT NULL,
ADD COLUMN     "to" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_AccountToTransaction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToTransaction_AB_unique" ON "_AccountToTransaction"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToTransaction_B_index" ON "_AccountToTransaction"("B");

-- AddForeignKey
ALTER TABLE "_AccountToTransaction" ADD CONSTRAINT "_AccountToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToTransaction" ADD CONSTRAINT "_AccountToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
