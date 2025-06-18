FROM node:20-slim

WORKDIR /usr/src/app

RUN apt update; apt install -y vim curl

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 11451

RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]