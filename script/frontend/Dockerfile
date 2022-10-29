FROM node:15.14.0

RUN npm install -g http-server

WORKDIR /home/mrri/frontendtest

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist" ]