# Stage 1: Build TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files trước → tận dụng Docker layer cache
# (chỉ re-install khi package.json thay đổi, không phải khi sửa code)
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production image — chỉ chứa dist/ và production dependencies
FROM node:20-alpine AS production

# Cài wget để healthcheck trong docker-compose hoạt động
RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./
# --omit=dev thay cho --only=production (đã deprecated từ npm v9)
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/index.js"]
