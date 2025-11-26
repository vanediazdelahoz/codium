FROM node:20-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   openssl \
	   build-essential \
	   g++ \
	   make \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY workers/cpp-worker/package*.json ./
COPY workers/cpp-worker/tsconfig.json ./

COPY prisma ./prisma

RUN npm install

# Generate Prisma Client so @prisma/client is ready at runtime
RUN npx prisma generate

COPY workers/cpp-worker/worker.ts ./

CMD ["npm", "start"]