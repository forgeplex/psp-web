FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/checkout ./apps/checkout
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@psp/checkout

FROM nginx:alpine
COPY apps/checkout/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/checkout/dist /usr/share/nginx/html
EXPOSE 80
