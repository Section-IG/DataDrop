#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
until nc -z -v -w30 database 5432
do
    echo "Waiting for PostgreSQL..."
    sleep 1
done

echo "PostgreSQL is up and running!"

node ./index.js | tee -a /var/log/datadrop/console.log
