FROM node:lts-alpine AS build

WORKDIR /app

RUN apk --no-cache add zip

COPY . .
RUN yarn install --frozen-lockfile \
    && yarn env-gen \
    && yarn build \
    && yarn install --production \
    && zip -r app.zip ./node_modules ./build ./yarn.lock ./.env ./entrypoint.sh

# ------------------------------------------------------------
FROM node:lts-alpine AS app

WORKDIR /app

RUN apk --no-cache add unzip

COPY --from=build /app/app.zip .
RUN unzip app.zip \
    && rm app.zip \
    && mv ./build/* . \
    && rm -rf ./build \
    && chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
