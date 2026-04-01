-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "patientWallet" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "doctor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
