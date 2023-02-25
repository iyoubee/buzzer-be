-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "selfId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_selfId_fkey" FOREIGN KEY ("selfId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
