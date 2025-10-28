FROM node:20-slim

WORKDIR /app

# Instalar el compilador de C++ (g++) y Docker CLI
RUN apt-get update && apt-get install -y g++ docker.io

COPY package*.json ./
RUN npm install
COPY . .