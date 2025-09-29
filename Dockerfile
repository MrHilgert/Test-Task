# Build stage
FROM node:24-alpine3.21 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:24-alpine3.21 AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist

COPY --from=build /app/drizzle.config.ts /app/drizzle.config.ts
COPY --from=build /app/src/database /app/src/database

EXPOSE $BACKEND_PORT

CMD ["node", "./dist/index.js"]