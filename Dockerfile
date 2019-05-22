FROM node

WORKDIR /app

COPY . /app

RUN yarn install
