FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/merchant ./apps/merchant
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@psp/merchant

FROM nginx:alpine
COPY apps/merchant/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/merchant/dist /usr/share/nginx/html
EXPOSE 80
