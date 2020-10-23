ARG NODE_VERSION=10-alpine

FROM node:${NODE_VERSION}
ARG ENVIRONMENT=prod
ENV ENV=${ENVIRONMENT}

ENV node_env=development

RUN apk add --no-cache git

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
COPY mobile-app/src/environments/environment.ts.example /usr/src/app/src/environments/environment.dev.ts
COPY mobile-app/src/environments/environment.ts.example /usr/src/app/src/environments/environment.prod.ts

RUN npm install -g ionic

RUN npm install

COPY ./ /usr/src/app/

RUN npm run "ionic:build"


