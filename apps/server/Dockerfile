FROM node:20.9.0

WORKDIR /usr/app

COPY package*.json package-lock*.json ./
RUN npm install

COPY . .

RUN npm run build:server

EXPOSE 3005

CMD ["npm", "run", "start:server"]