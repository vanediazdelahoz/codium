FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 py3-pip docker-cli

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
