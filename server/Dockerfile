FROM node:20-alpine3.18

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retries 5 && \
    for i in 1 2 3 4 5; do npm install --verbose && break || echo "Retrying in 5 seconds..." && sleep 5; done

COPY . ./
RUN npm run build
ENV PORT 8000
EXPOSE $PORT

CMD ["node","dist/index.js"]
