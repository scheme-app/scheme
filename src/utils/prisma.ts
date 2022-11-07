import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ["query"],
  });

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  storage: {
    // type: "redis",
    type: "memory",
    options: {
      // client: redis,
      invalidation: true,
      log: console,
    },
  },
  cacheTime: 300,
  onHit: (key) => {
    console.log("hit", key);
  },
  onMiss: (key) => {
    console.log("miss", key);
  },
  onError: (key) => {
    console.log("error", key);
  },
});

prisma.$use(cacheMiddleware);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
