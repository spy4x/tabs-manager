/*
Warnings:

- Added the required column `user_id` to the `tags_to_links` table without a default value. This is not possible if the table is not empty.

 */
-- AlterTable
ALTER TABLE
  "tags_to_links"
ADD COLUMN
  "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE
  "tags_to_links" ADD CONSTRAINT "tags_to_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
