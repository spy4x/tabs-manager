/*
Warnings:

- The `priority` column on the `links` table would be dropped and recreated. This will lead to data loss if there is data in the column.

 */
-- AlterTable
ALTER TABLE
  "links"
DROP COLUMN
  "priority",
ADD COLUMN
  "priority" SMALLINT NOT NULL DEFAULT 0;

-- DropEnum
DROP
  TYPE "LinkPriority";
