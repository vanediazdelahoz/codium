FROM node:20-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   openssl \
	   default-jdk \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY workers/java-worker/package*.json ./
COPY workers/java-worker/tsconfig.json ./

COPY prisma ./prisma

RUN npm install

# Generate Prisma Client so @prisma/client is ready at runtime
RUN npx prisma generate

COPY workers/java-worker/worker.ts ./

CMD ["npm", "start"]