FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY workers/nodejs-worker/package*.json ./
COPY workers/nodejs-worker/tsconfig.json ./

COPY prisma ./prisma

RUN npm install

COPY workers/nodejs-worker/worker.ts ./

CMD ["npm", "start"]