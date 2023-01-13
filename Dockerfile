FROM node:18.12.1-alpine as base
RUN apk update && apk add openssl
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:18.12.1-alpine as production
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/*.json ./
# COPY --from=base /app/.env ./
COPY --from=base /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
