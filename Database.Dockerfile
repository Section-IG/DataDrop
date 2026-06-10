FROM postgres:15.1

ARG POSTGRES_DB

# Install pg_cron extension
RUN apt-get update && apt-get install -y postgresql-15-cron && apt-get clean

# Add pg_cron to shared_preload_libraries
RUN echo "shared_preload_libraries='pg_cron'" >> /usr/share/postgresql/postgresql.conf.sample
RUN echo "cron.database_name = '${POSTGRES_DB}'" >> /usr/share/postgresql/postgresql.conf.sample

# pg_cron extension is created by Prisma migrations at bot startup
