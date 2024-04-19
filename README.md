Welcome to the ASPIRE test-case.
Check the [docs](./docs/) repo for more documentation

## Available apps of the repo

- **populate-db**: Independantly fill the database with some data to help during development
- **server**: API of the domain, which interacts with the DB

## Requirements

- [TestCaseDemo && Develop] Install Docker on your laptop
- [Develop] Install node.js and npm
- [Develop] `npm install` to install dependancies

## [TestCaseDemo] Run the demo

1. Open Docker
2. At the root `./aspire-mini-app`, run to create the services:
   - If you have npm: `npm demo:start`
   - If you don't have npm: `docker-compose -f ./docker-compose.demo.yaml up -d`

This will generate:

- a mongo database on PORT 27027 with some initial data
- a server on PORT 3005

**Stop the demo**: at the root `/aspire-mini-app`, run `npm demo:stop` or `docker-compose -f ./docker-compose.demo.yaml down --rmi all` if you don't have npm.
This will remove everything on your docker except the volumes.

## [Develop] Run locally the apps

### Local development

Start the server with some data in the database: run `npm run local:start`

To stop the application and the database: run `npm run local:stop`.

Don't forget to remove the volumes generated.

### Run apps individually

If you want to run manually one of the applications defined above, you'll need to run at the root of the repo:

1. `npm run build:packages` to first build the packages
2. `npm run build:<appName>` to build the application you want to run
3. `npm run start:<appName>` to start the application
