FROM node:20-slim

WORKDIR /app

# Instalar el cliente de Docker
RUN apt-get update && apt-get install -y docker.io

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .

# Comando de inicio robusto que ejecuta ts-node
CMD ["sh", "-c", "npm start"]