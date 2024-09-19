FROM node:17

WORKDIR /app

COPY . /app

EXPOSE 3200
RUN npm install

CMD [ "npm","start" ]