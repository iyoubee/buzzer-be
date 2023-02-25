/*
  Warnings:

  - You are about to drop the column `closeFriends` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `closeFriends` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "closeFriends";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "closeFriends",
ADD COLUMN     "messageId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
