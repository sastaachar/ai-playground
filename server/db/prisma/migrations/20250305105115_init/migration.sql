-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "host" TEXT,
    "code" TEXT,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);
