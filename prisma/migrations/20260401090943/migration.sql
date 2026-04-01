-- CreateTable
CREATE TABLE "ShareLink" (
    "id" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "patientWallet" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);
