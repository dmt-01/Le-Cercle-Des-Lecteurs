FROM node:23-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm && pnpm install

COPY ./ ./

EXPOSE 3000

CMD ["pnpm", "run", "dev"]