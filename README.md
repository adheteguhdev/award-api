# Awards API

## Introduction
#### Technology Stacks & Packages:
 - NodeJS v18.16.0
 - Express
 - TypeScript
 - Testing : Mocha & Chai
 - Logging : winston, winston-daily-rotate-file and morgan
 - Database: MongoDB v5.0.16
 - Cache   : Redis v6.0
 - Swagger API Documentation & Postman Documentation
 - Docker
 - docker-compose

## API Documentation

### Swagger
Too see the API Documentation Swagger locally 
- install [reload](https://www.npmjs.com/package/reload) with `npm` or `yarn`

```bash
npm i -g reload
```
```bash
yarn global add reload
```

- Run `reload`. Default port is `8080` for specific port use flag `-p` with port
```bash 
$ reload -d apispec/

Reload web server:
listening on port 8080
monitoring dir apispec/

```
- open browser [http://localhost:8080](http://localhost:8080)

### Postman Documentation
It's easier to test the award api using this as it can be run directly in postman.

Too see API Documentation Postman just open browser [https://documenter.getpostman.com/view/26502057/2s93Xwzj8p](https://documenter.getpostman.com/view/26502057/2s93Xwzj8p)


## Installation

- Run command `yarn` or `npm i`
```bash
yarn
```
- Create `.env` file from `.env.example` 

## .env

- `NODE_ENV`: development or production
- `APP_PORT`: app / server port
- `LOG_LEVEL`: level logging
- `LOG_DIR`: directory for write log
- `DATABASE_URL`: database url to mongodb
- `DATABASE_NAME`: mongodb database name mongodb
- `PUBLIC_KEY`: public key for jwt (RS256)
- `PRIVATE_KEY`: private key for jwt (RS256)
- `REDIS_URL`: redis url
- `DOCKER_MONGO_PORT`: to specify host port that will be mapped by docker mongodb

## Run project 
- Start app must to build first with `$ yarn compile` and then `$ yarn start`
```bash
yarn compile
```
```bash
yarn start
```
- For development `$ yarn dev`
```bash
yarn dev
```
- For running test `$ yarn test` 
```bash
yarn test
```

### Run project using docker-compose
- Start app `$ docker-compose up -d` the containers will run in the background and not display logs in terminal if want to see the logs in terminal just start app without flag `-d` like this `$ docker-compose up`
```bash
docker-compose up
```

if you got ERROR: Couldn't connect to Docker. Try with `sudo`

## Note
- We can use the user data that I initiated for testing, we can use email`test@member.id` for Sign In and then we can get token to access all api route with copy the token into header Authorization with format `Bearer xxx.yyy.zzz` only two api route dont require authorization `Create User` and `Sign In`. 
- If dont want to use email testing `test@member.id` we can create new user with following api documentation

## License
[MIT](https://choosealicense.com/licenses/mit/)
