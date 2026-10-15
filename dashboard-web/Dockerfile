# syntax=docker/dockerfile:1.7

# ---- deps (cache npm ci) ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_BASE_URL=http://localhost:3000
ARG VITE_USE_MOCKS=true
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS
RUN npm run build

# ---- runtime (nginx, static, non-root by default) ----
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
