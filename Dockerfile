FROM node:19-alpine

WORKDIR /app/

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT npm run dev
