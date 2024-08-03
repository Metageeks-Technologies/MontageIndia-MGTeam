FROM node:20-alpine3.18

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN npm install

COPY . ./
RUN npm run build
ENV PORT 8000
EXPOSE $PORT

CMD ["node","dist/index.js"]
