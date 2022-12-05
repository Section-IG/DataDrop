# DataDrop
[![Continuous Delivery](https://github.com/Section-IG/DataDrop/actions/workflows/deployment.yml/badge.svg)](https://github.com/Section-IG/DataDrop/actions/workflows/deployment.yml)

Discord bot built with Discord.JS for Section IG guild.

The following environment variables must be filled in a `.env` file.
This file is used when building the container to generate a production-ready .env file.
```dotenv
DISCORD_TOKEN=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DATABASE_PORT=5432
DATABASE_HOST=localhost
NODE_ENV=development
SENGRID_API_KEY=
```
An empty copy of this file is available as [#.env](./#.env).

## Deployment
As the app is dockerized, you can deploy it on your server or locally on your machine.

If you wish to deploy it with a development configuration*, you can run `docker-compose up`.

If you need it to be deployed on production ground, change the `NODE_ENV=development` value in the `.env` file by `NODE_ENV=production`.
You can then run the `docker-compose up` command!

_\* the Developer eXperience (DX) is a priority to us, which means default commands will always trigger processes for the development environment, never for the production one!_
