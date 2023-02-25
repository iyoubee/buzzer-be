# buzzer-be

## Back-End for RISTEK MedSOS

[![N|Solid](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/8/30/ccdab75832d3da51023b07c109c3971a~tplv-t2oaga2asx-image.image)](https://nestjs.com/)

## How To Run on Local Environment

### Installation

NestJS requires [Node.js](https://nodejs.org/) v10+ and [Docker](https://www.docker.com/) to run.

Clone this repo to your computer and install dependencies. (This project using yarn)

```sh
git clone https://github.com/iyoubee/buzzer-be
cd buzzer-be
yarn install
```

Compose docker for local database. (make sure they run on port 5432)

```sh
docker-compose up
```

Make `.env` file in root folder. Copy all value in `.env.test` file and paste to `.env` file.

Push schema to db.

```sh
npx prisma migrate dev
npx prisma db push
```

you can also open prisma studio.

```sh
npx prisma studio
```

run the project. (make sure they run on port 3333)

```sh
yarn start:dev
```
