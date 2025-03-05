/*
  Warnings:

  - Added the required column `updatedAt` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeploymentType" AS ENUM ('VisualEmbedJS', 'Other', 'RestApi');

-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "DeploymentType",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
