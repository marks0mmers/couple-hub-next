/*
  Warnings:

  - You are about to drop the `Index` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CoupleType" AS ENUM ('DATING', 'ENGAGED', 'MARRIED');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_coupleId_fkey";

-- DropTable
DROP TABLE "Index";

-- CreateTable
CREATE TABLE "Couple" (
    "id" TEXT NOT NULL,
    "relationshipStart" TIMESTAMP(3),
    "coupleType" "CoupleType" NOT NULL DEFAULT 'DATING',

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
