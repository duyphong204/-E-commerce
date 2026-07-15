import { Request, Response, NextFunction } from "express";
import redisClient from "../../config/redis";

const buildCacheKey = (req: Request): string =>
  `cache:${req.baseUrl}${req.path}:${new URLSearchParams(req.query as Record<string, string>).toString()}`;

export const cacheMiddleware = (ttl = 3600) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== "GET" || !redisClient.isReady) {
      return next();
    }

    const key = buildCacheKey(req);

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        res.status(200).json(JSON.parse(cached));
        return;
      }
    } catch {
      return next();
    }

    res.setHeader("X-Cache", "MISS");

    const _json = res.json.bind(res);
    res.json = (body: unknown): Response => {
      if (res.statusCode === 200 && body != null && redisClient.isReady) {
        redisClient
          .setEx(key, ttl, JSON.stringify(body))
          .catch(() => {});
      }
      return _json(body);
    };

    next();
  };
};

export const clearCachePattern = async (pattern: string): Promise<void> => {
  if (!redisClient.isReady) return;

  try {
    const pipeline = redisClient.multi();
    let count = 0;

    for await (const key of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      pipeline.del(key);
      count++;

      if (count % 100 === 0) {
        await pipeline.exec();
      }
    }

    if (count % 100 !== 0) {
      await pipeline.exec();
    }

    if (count > 0) {
      console.log(`[Redis] Đã xóa ${count} cache key(s) khớp: "${pattern}"`);
    }
  } catch (err) {
    console.error("[Redis] Lỗi xóa cache:", err);
  }
};
