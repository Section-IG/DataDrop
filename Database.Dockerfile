FROM postgres:15.1

# Install the pg_cron extension
RUN apt-get update && apt-get install -y postgresql-15-cron

# Run the postgres server with the pg_cron extension
CMD ["postgres", "-c", "shared_preload_libraries=pg_cron"]
