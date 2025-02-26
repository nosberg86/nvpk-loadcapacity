# Etapa 1: Construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json prisma/schema.prisma ./
RUN npm install -y
COPY . .
RUN npx prisma generate --schema=/app/prisma/schema.prisma
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
