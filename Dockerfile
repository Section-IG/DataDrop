FROM node:lts-alpine as BUILD

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# ------------------------------------------------------------
FROM node:lts-alpine as APP

WORKDIR /app

ENV NODE_ENV=production

COPY --from=BUILD /app/build ./build
COPY --from=BUILD /app/build/package.json .
COPY --from=BUILD /app/yarn.lock .
COPY --from=BUILD /app/.env .
COPY --from=BUILD /app/config.production.json .
COPY --from=BUILD /app/ecosystem.config.js .

RUN yarn install --production
RUN yarn global add pm2
CMD [ "pm2-runtime", "ecosystem.config.js" ]
