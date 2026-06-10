FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN apk --no-cache add curl \
    && yarn install --frozen-lockfile \
    && yarn build \
    && yarn prisma generate \
    && curl -fsS https://dotenvx.sh/install.sh | sh \
    && chmod +x /app/scripts/entrypoint.sh
