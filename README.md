# DataDrop
[![Continuous Delivery](https://github.com/Section-IG/DataDrop/actions/workflows/deployment.yml/badge.svg)](https://github.com/Section-IG/DataDrop/actions/workflows/deployment.yml)

Discord bot built with Discord.JS for Section IG guild.

The following environment variables must be filled in a `templated.env` file.
This file is used when building the container to generate a production-ready .env file.
```dotenv
DISCORD_TOKEN=
SENDGRID_API_KEY=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```
An empty copy of this file is available as [#templated.env](./#templated.env).

## Deployment
As the app is dockerized, you can deploy it on your server or locally on your machine.
First step no matter what you want to achieve is to define an environment variable named `DATABASE_PORT` on your machine.
It should hold the value 5432 by default.

Then:
- If you wish to deploy it with a development configuration*, you can run `docker-compose up`.
- If you need it to be deployed on production ground, give the docker-compose an environment argument: `ENVIRONMENT=production docker-compose up`.


_\* the Developer eXperience (DX) is a priority to us, which means default commands will always trigger processes for the development environment, never for the production one!_
