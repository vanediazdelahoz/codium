FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY workers/cpp-worker/package*.json ./
COPY workers/cpp-worker/tsconfig.json ./

COPY prisma ./prisma

RUN npm install

COPY workers/cpp-worker/worker.ts ./

CMD ["npm", "start"]