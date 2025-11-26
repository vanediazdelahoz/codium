FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma Client during the build stage so the generated client
# can be copied into the final image (see COPY --from=builder for node_modules below)
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy the generated Prisma client from the builder stage so runtime has
# the generated client files and the runtime doesn't need the prisma dev tooling.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
