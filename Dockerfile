FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite bakes these into the JS bundle at build time — pass them as build args.
ARG VITE_API_BASE_URL=/api
ARG VITE_AUTH_MODE=openclaw
ARG VITE_APP_NAME=Neural Hub
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AUTH_MODE=$VITE_AUTH_MODE
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN npm run build

FROM nginx:alpine
# vite.config.ts sets base: '/cc/' so assets are referenced at /cc/...
# Copy dist into a cc/ subdirectory to match.
COPY --from=builder /app/dist /usr/share/nginx/html/cc
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
