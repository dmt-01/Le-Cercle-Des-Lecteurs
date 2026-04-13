FROM node:23-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm && pnpm install

COPY ./ ./

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]