FROM node:15.14.0

WORKDIR /home/mrri/api_test_docker

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=3077

EXPOSE 3077

CMD [ "npm", "run", "build" ]