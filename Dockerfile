FROM node:12

RUN mkdir -p /usr/mars-waether-api
COPY . /usr/mars-waether-api
WORKDIR /usr/mars-waether-api
RUN npm install --production

ENV PORT 4545
EXPOSE  $PORT

CMD ["npm", "start"]