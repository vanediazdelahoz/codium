FROM node:20-slim

WORKDIR /app

# Instalar Python, pip y Docker CLI
RUN apt-get update && apt-get install -y python3 python3-pip docker.io

COPY package*.json ./
RUN npm install
COPY . .