FROM node:lts-alpine AS BUILD

WORKDIR /app

RUN apk --no-cache add zip

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn env-gen
RUN yarn build
RUN yarn install --production
RUN zip -r app.zip ./node_modules ./build ./yarn.lock ./.env

# ------------------------------------------------------------
FROM node:lts-alpine AS APP

WORKDIR /app

RUN apk --no-cache add unzip

COPY --from=BUILD /app/app.zip .
RUN unzip app.zip && rm app.zip && mv ./build/* . && rm -rf ./build

CMD ["sh", "-c", "sleep 2 && node ./index.js"]
