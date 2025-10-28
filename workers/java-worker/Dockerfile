FROM node:20-slim

WORKDIR /app

# Instalar Java (OpenJDK 17) y Docker CLI
RUN apt-get update && apt-get install -y openjdk-17-jdk docker.io

COPY package*.json ./
RUN npm install
COPY . .