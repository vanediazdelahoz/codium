FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY workers/java-worker/package*.json ./
COPY workers/java-worker/tsconfig.json ./

COPY prisma ./prisma

RUN npm install

COPY workers/java-worker/worker.ts ./

CMD ["npm", "start"]