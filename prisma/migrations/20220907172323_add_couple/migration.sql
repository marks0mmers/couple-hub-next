-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coupleId" TEXT;

-- CreateTable
CREATE TABLE "Index" (
    "id" TEXT NOT NULL,
    "relationshipStart" TIMESTAMP(3),

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Index"("id") ON DELETE SET NULL ON UPDATE CASCADE;
