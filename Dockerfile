FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN apk --no-cache add curl \
    && yarn install --frozen-lockfile \
    && yarn env-gen \
    && curl -fsS https://dotenvx.sh/install.sh | sh
