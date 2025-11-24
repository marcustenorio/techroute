# ==========================
# 1) Build da aplicação React
# ==========================
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


# ==========================
# 2) Servir com Nginx + envsubst runtime
# ==========================
FROM nginx:alpine

# Remove default conf
RUN rm -f /etc/nginx/conf.d/default.conf

# Copia build
COPY --from=build /app/build /usr/share/nginx/html

# Copia nginx.conf como default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia template do env.js
COPY env.template.js /usr/share/nginx/html/env.template.js

# instala envsubst
RUN apk add --no-cache gettext

# gera env.js na subida do container
RUN printf '#!/bin/sh\nset -e\nenvsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js\n' \
    > /docker-entrypoint.d/40-env.sh \
    && chmod +x /docker-entrypoint.d/40-env.sh

# permissões para OpenShift (grupo)
RUN chmod -R g+rwx /var/cache/nginx \
    && chmod -R g+rwx /var/run \
    && chmod -R g+rwx /usr/share/nginx/html

USER 1001

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
