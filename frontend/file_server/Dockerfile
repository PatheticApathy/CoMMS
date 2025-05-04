FROM node:23-alpine3.20

WORKDIR /app

COPY . /app


VOLUME ./public/

RUN npm install

CMD [ "npm", "start" ]
