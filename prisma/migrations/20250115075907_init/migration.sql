-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_createdById_fkey";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
