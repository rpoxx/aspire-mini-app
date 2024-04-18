Welcome to the ASPIRE test-case

## Available apps of the repo

- **client**: Application available to the User
- **populate-db**: Independantly fill the database with some data to help during development
- **server**: API of the domain, which interacts with the DB

## Requirements

- `npm install` to install dependancies
- Install Docker on your laptop

## Run the apps

If you want to run one of the applications defined above, you'll need to run at the root of the repo:

1. `npm run build:packages` to first build the packages
2. `npm run build:<appName>` to build the application you want to run
3. `npm run start:<appName>` to start the application

## Run the demo

1. Open Docker
2. At the root `/aspire-mini-app`, run `npm demo:start` to create the services

This will generate:

- a mongo database on PORT 27027 with some data
- a server on PORT 3005

**Stop the demo**: at the root `/aspire-mini-app`, run `npm demo:stop` to stop the services.
This will remove everything on your docker except the volumes.

---

## API Doc and use

https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/collection/31279199-48457e12-af79-4c03-8213-5d053e426487
