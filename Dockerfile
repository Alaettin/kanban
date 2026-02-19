FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Ensure data directory exists for sqlite file mount/use
RUN mkdir -p /app/data

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
