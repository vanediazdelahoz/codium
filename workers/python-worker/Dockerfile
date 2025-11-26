FROM node:20-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   openssl \
	   python3 \
	   python3-pip \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY workers/python-worker/package*.json ./
COPY workers/python-worker/tsconfig.json ./

COPY prisma ./prisma

RUN npm install

# Generate Prisma Client so @prisma/client is ready at runtime
RUN npx prisma generate

COPY workers/python-worker/worker.ts ./

CMD ["npm", "start"]