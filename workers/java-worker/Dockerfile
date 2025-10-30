FROM node:20-slim

WORKDIR /app

# NO se instala nada con apt-get, solo las dependencias de Node.js
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

# Comando de inicio para desarrollo que ejecuta ts-node
CMD ["npm", "start"]