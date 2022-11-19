FROM node:lts-alpine as BUILD

ARG ENVIRONMENT=development
WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile
RUN NODE_ENV=$ENVIRONMENT yarn run env-gen
RUN yarn build
RUN yarn install --production

# ------------------------------------------------------------
FROM node:lts-alpine as APP

WORKDIR /app

COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/build ./build
COPY --from=BUILD /app/build/package.json .
COPY --from=BUILD /app/yarn.lock .
COPY --from=BUILD /app/.env .

CMD [ "yarn", "start" ]
