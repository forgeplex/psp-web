FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/agent ./apps/agent
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@psp/agent

FROM nginx:alpine
COPY apps/agent/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/agent/dist /usr/share/nginx/html
EXPOSE 80
