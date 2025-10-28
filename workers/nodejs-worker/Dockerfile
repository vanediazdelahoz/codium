FROM node:20-slim

WORKDIR /app

# Instalar Docker CLI
RUN apt-get update && apt-get install -y docker.io

COPY package*.json ./
RUN npm install
COPY . .