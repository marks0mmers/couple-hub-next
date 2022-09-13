-- CreateEnum
CREATE TYPE "WeddingVenuePriceType" AS ENUM ('FLAT_FEE', 'PER_HOUR');

-- AlterTable
ALTER TABLE "Couple" ALTER COLUMN "relationshipStart" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Wedding" ALTER COLUMN "weddingDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "WeddingVenue" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceType" "WeddingVenuePriceType" NOT NULL,
    "rentalStart" TIME(2),
    "rentalEnd" TIME(2),
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,

    CONSTRAINT "WeddingVenue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeddingVenue" ADD CONSTRAINT "WeddingVenue_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
