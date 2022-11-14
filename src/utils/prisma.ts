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

// const redis = new Redis(process.env.REDIS_URL!);

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  storage: {
    // type: "redis",
    type: "memory",
    options: {
      // client: redis as any,
      invalidation: true,
      log: console,
    },
  },
  // cacheTime: 300,
  cacheTime: 0,
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

// prisma.$use(cacheMiddleware);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
