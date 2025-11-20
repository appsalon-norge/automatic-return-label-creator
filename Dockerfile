# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Bygg-argument for Shopify API key, og eksponer den som Vite-var
ARG SHOPIFY_API_KEY
ENV VITE_SHOPIFY_API_KEY=${SHOPIFY_API_KEY}

# Installer avhengigheter
COPY package*.json ./
RUN npm ci

# Kopier resten av koden
COPY . .

# Generer Prisma client
RUN npx prisma generate

# Bygg appen
RUN npm run build

# --- Run stage ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Kopier alt fra builder
COPY --from=builder /app . 

# Sørg for at /data finnes (volumet mountes her)
RUN mkdir -p /data

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate && npm run start"]
