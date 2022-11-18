FROM node:lts-alpine as BUILD

ARG ENVIRONMENT=development
WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile
RUN NODE_ENV=$ENVIRONMENT yarn run env-gen
RUN yarn build

# ------------------------------------------------------------
FROM node:lts-alpine as APP

WORKDIR /app

COPY --from=BUILD /app/build ./build
COPY --from=BUILD /app/build/package.json .
COPY --from=BUILD /app/yarn.lock .
COPY --from=BUILD /app/.env .
COPY --from=BUILD /app/ecosystem.config.js .

RUN yarn install --production
RUN yarn global add pm2
CMD [ "pm2-runtime", "ecosystem.config.js" ]
