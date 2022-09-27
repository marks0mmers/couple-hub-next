-- CreateTable
CREATE TABLE "WeddingBudgetItem" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "goalAmount" DOUBLE PRECISION NOT NULL,
    "actualAmount" DOUBLE PRECISION,
    "actualPaid" DOUBLE PRECISION,
    "dueDate" TIMESTAMP(3),

    CONSTRAINT "WeddingBudgetItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeddingBudgetItem" ADD CONSTRAINT "WeddingBudgetItem_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
