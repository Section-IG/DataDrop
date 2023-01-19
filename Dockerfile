FROM node:lts-alpine as BUILD

WORKDIR /app

RUN apk add zip

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn env-gen
RUN yarn build
RUN yarn install --production
RUN zip -r app.zip ./node_modules ./build ./yarn.lock ./.env

# ------------------------------------------------------------
FROM node:lts-alpine as APP

WORKDIR /app

RUN apk add unzip

COPY --from=BUILD /app/app.zip .
RUN unzip app.zip
RUN rm app.zip
RUN mv ./build/* .
RUN rm -rf ./build

CMD ["sh", "-c", "sleep 2 && node ./index.js"]
