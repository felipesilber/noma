FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy Prisma schema early so generate can cache
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest and build
COPY . .
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules from builder to keep generated Prisma client
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run migrations on startup, then boot the app
CMD ["sh", "-c", "node -e \"console.log('Running prisma migrate deploy...')\" && npx prisma migrate deploy && node dist/main.js"]


