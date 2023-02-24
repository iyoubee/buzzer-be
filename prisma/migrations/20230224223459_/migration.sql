/*
  Warnings:

  - The `closeFriends` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "closeFriends",
ADD COLUMN     "closeFriends" INTEGER[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "closeFriends" INTEGER[];

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
