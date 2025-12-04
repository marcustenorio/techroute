# ====== 1) Build da aplicação React ======
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# ====== 2) Servir com Nginx ======
FROM nginx:alpine

# Remover default
RUN rm -f /etc/nginx/conf.d/default.conf

# Copiar build do React
COPY --from=build /app/build /usr/share/nginx/html

# Copiar config runtime manualmente (REQUIRED)
COPY public/runtime-config.js /usr/share/nginx/html/runtime-config.js

# Copiar config do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Permissões OpenShift
RUN chmod -R g+rwx /var/cache/nginx \
    && chmod -R g+rwx /var/run \
    && chmod -R g+rwx /usr/share/nginx/html

USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
