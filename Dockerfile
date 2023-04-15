FROM node:18.16.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn compile

CMD ["yarn", "start"]