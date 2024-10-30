FROM node:lts-alpine AS build

WORKDIR /app

RUN apk --no-cache add zip

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn env-gen
RUN yarn build
RUN yarn install --production
RUN zip -r app.zip ./node_modules ./build ./yarn.lock ./.env ./entrypoint.sh

# ------------------------------------------------------------
FROM node:lts-alpine AS app

WORKDIR /app

RUN apk --no-cache add unzip

COPY --from=build /app/app.zip .
RUN unzip app.zip && rm app.zip && mv ./build/* . && rm -rf ./build
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
