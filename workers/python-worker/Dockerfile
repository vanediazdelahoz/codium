FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY workers/python-worker/package*.json ./
COPY workers/python-worker/tsconfig.json ./

COPY prisma ./prisma

RUN npm install

COPY workers/python-worker/worker.ts ./

CMD ["npm", "start"]