/*
  Warnings:

  - Made the column `dob` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dob" SET NOT NULL,
ALTER COLUMN "dob" SET DATA TYPE DATE;
