#!/bin/sh
set -e

echo "Running database migrations..."
yarn prisma migrate deploy

echo "Deploying slash commands..."
if [ "$NODE_ENV" = "production" ]; then
    node ./scripts/deploy-commands.cjs --prod
else
    node ./scripts/deploy-commands.cjs --guild
fi

echo "Starting bot..."
exec yarn start
