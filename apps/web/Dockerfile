FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# ── dev target ──────────────────────────────────────────────────────────────
FROM base AS dev
ENV NODE_ENV=development
COPY package.json ./
RUN pnpm install --include=dev
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev"]
