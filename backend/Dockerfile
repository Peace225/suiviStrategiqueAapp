# Étape 1 : Build de l'application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Exécution
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/config/serviceAccountKey.json ./dist/config/
RUN npm install --only=production

EXPOSE 5000
CMD ["node", "dist/server.js"]