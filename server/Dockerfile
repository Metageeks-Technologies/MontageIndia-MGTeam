FROM node:20-alpine3.18

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . ./
RUN npm run build
ENV PORT 8000
EXPOSE $PORT

CMD ["node","dist/index.js"]
