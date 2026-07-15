import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    reconnectStrategy: (retries: number) => Math.min(retries * 300, 3000),
    connectTimeout: 5000,
  },
}) as RedisClientType;

let _warnedOffline = false;

redisClient.on("connect", () => {
  _warnedOffline = false;
  console.log("[Redis] Đang kết nối...");
});

redisClient.on("ready", () => {
  console.log("[Redis] ✅ Sẵn sàng hoạt động!");
});

redisClient.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    if (!_warnedOffline) {
      console.warn("[Redis] ⚠️  Không thể kết nối. Server vẫn chạy bình thường, caching & rate-limit tạm dừng.");
      _warnedOffline = true;
    }
    return;
  }
  console.error("[Redis] ❌ Lỗi:", err.message);
});

export const connectRedis = (): void => {
  redisClient.connect().catch(() => {
  });
};

export default redisClient;
