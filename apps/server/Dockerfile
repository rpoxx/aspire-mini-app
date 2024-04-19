FROM node:20.9.0

WORKDIR /usr/app

COPY package*.json package-lock*.json ./
RUN npm install

COPY . .

RUN npm run build:packages
RUN npm run build:populate-db
# Run server build
RUN npm run build:server

EXPOSE 3005

CMD ["sh", "-c", "npm run start:populate-db && npm run start:server"]