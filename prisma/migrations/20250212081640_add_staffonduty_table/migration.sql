-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('Active', 'Inactive', 'OnBreak');

-- CreateTable
CREATE TABLE "StaffOnDuty" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "StaffStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffOnDuty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffOnDuty_userId_idx" ON "StaffOnDuty"("userId");

-- AddForeignKey
ALTER TABLE "StaffOnDuty" ADD CONSTRAINT "StaffOnDuty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
