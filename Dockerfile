
FROM node:20-alpine AS build

WORKDIR /app


ARG PUBLIC_API_BASE_URL=http://localhost/api
ARG PUBLIC_KEYCLOAK_URL=http://localhost/auth
ARG PUBLIC_KEYCLOAK_REALM=agroflowers-realm
ARG PUBLIC_KEYCLOAK_CLIENT_ID=agroflowers-web
ARG PUBLIC_USE_MOCKS=true

ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL
ENV PUBLIC_KEYCLOAK_URL=$PUBLIC_KEYCLOAK_URL
ENV PUBLIC_KEYCLOAK_REALM=$PUBLIC_KEYCLOAK_REALM
ENV PUBLIC_KEYCLOAK_CLIENT_ID=$PUBLIC_KEYCLOAK_CLIENT_ID
ENV PUBLIC_USE_MOCKS=$PUBLIC_USE_MOCKS

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-alpine

RUN apk add --no-cache nginx

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

COPY nginx.conf /etc/nginx/http.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENV HOST=127.0.0.1
ENV PORT=3000

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
