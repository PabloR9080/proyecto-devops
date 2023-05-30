FROM node:20

WORKDIR /app/

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN export ELASTIC_APM_CONFIG_FILE=./elastic-apm-node.js

RUN npx prisma generate

RUN npm run build | true

EXPOSE 3000

ENTRYPOINT npm run start
