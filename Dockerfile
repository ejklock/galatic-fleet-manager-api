FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN mv .env.docker .env
RUN mv .env.test.docker .env.test

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start:prod" ]
