import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient();
export const getDbClient = () => {
  return prisma;
}