FROM node:19-alpine

WORKDIR /app/

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npx prisma generate 

RUN npm run build || true

EXPOSE 3000

ENTRYPOINT npm run start
