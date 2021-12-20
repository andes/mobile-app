ARG NODE_VERSION=12-alpine

FROM node:${NODE_VERSION}
ARG ENVIRONMENT=prod
ENV ENV=${ENVIRONMENT}

ENV node_env=development

RUN apk add --no-cache git

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY ./src/environments/environment.ts.example /usr/src/app/src/environments/environment.ts
COPY ./src/environments/environment.ts.example /usr/src/app/src/environments/environment.test.ts
COPY ./src/environments/environment.ts.example /usr/src/app/src/environments/environment.dev.ts
COPY ./src/environments/environment.ts.example /usr/src/app/src/environments/environment.prod.ts

RUN npm install -g ionic cordova
RUN npm install

COPY ./ /usr/src/app/

RUN sed -i '20i\"baseHref\": \"/mobile/\",' angular.json 

RUN npm run "build:browser"

