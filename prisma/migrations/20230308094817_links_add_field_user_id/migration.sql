/*
  Warnings:

  - Added the required column `user_id` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "links" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
