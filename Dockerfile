FROM node:alpine

WORKDIR /app
ADD package* /app/

RUN npm install --production

ADD . /app

CMD ["/usr/local/bin/node", "server.js"]