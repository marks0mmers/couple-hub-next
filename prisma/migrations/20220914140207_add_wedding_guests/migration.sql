-- CreateTable
CREATE TABLE "WeddingGuestTier" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "WeddingGuestTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingGuest" (
    "id" TEXT NOT NULL,
    "weddingGuestTierId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WeddingGuest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeddingGuestTier" ADD CONSTRAINT "WeddingGuestTier_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingGuest" ADD CONSTRAINT "WeddingGuest_weddingGuestTierId_fkey" FOREIGN KEY ("weddingGuestTierId") REFERENCES "WeddingGuestTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
