FROM nginx:alpine

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 自定义 nginx 配置，支持 SPA 路由
RUN cat > /etc/nginx/conf.d/default.conf << 'NGINX'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /health {
        return 200 'ok';
        add_header Content-Type text/plain;
    }
}
NGINX

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
