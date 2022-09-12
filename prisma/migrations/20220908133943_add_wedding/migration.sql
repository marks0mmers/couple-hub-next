-- CreateTable
CREATE TABLE "Wedding" (
    "id" TEXT NOT NULL,
    "weddingDate" TIMESTAMP(3),
    "coupleId" TEXT NOT NULL,

    CONSTRAINT "Wedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wedding_coupleId_key" ON "Wedding"("coupleId");

-- AddForeignKey
ALTER TABLE "Wedding" ADD CONSTRAINT "Wedding_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
