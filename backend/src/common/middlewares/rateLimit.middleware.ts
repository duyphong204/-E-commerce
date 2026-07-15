import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../../config/redis";

const createSendCommand = (prefix: string) =>
  async (...args: string[]): Promise<any> => {
    if (!redisClient.isReady) {
      const cmd = args[0]?.toUpperCase();
      if (cmd === "SCRIPT") return "0000000000000000000000000000000000000000";
      if (cmd === "EVALSHA") return [0, 0];
      return null;
    }
    return redisClient.sendCommand(args);
  };

const createStore = (prefix: string): RedisStore =>
  new RedisStore({
    prefix: `rl:${prefix}:`,
    sendCommand: createSendCommand(prefix),
  });

// 200 req / 15 phút / IP — Toàn hệ thống
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: createStore("global"),
  // Bỏ qua rate limit hoàn toàn khi Redis offline → Fail-Open
  skip: () => !redisClient.isReady,
  message: {
    success: false,
    statusCode: 429,
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.",
  },
});

// 20 req / 15 phút / IP — Chỉ áp dụng cho Auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: createStore("auth"),
  skip: () => !redisClient.isReady,
  message: {
    success: false,
    statusCode: 429,
    message: "Quá nhiều lượt thử đăng nhập, vui lòng thử lại sau 15 phút.",
  },
});
