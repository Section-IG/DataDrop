-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cron";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- CreateTable
CREATE TABLE "cron"."job" (
    "jobid" BIGSERIAL NOT NULL,
    "schedule" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "nodename" TEXT NOT NULL DEFAULT 'localhost',
    "nodeport" INTEGER NOT NULL DEFAULT inet_server_port(),
    "database" TEXT NOT NULL DEFAULT current_database(),
    "username" TEXT NOT NULL DEFAULT CURRENT_USER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "jobname" TEXT,
    CONSTRAINT "job_pkey" PRIMARY KEY ("jobid")
);

-- CreateTable
CREATE TABLE "cron"."job_run_details" (
    "jobid" BIGINT,
    "runid" BIGSERIAL NOT NULL,
    "job_pid" INTEGER,
    "database" TEXT,
    "username" TEXT,
    "command" TEXT,
    "status" TEXT,
    "return_message" TEXT,
    "start_time" TIMESTAMPTZ(6),
    "end_time" TIMESTAMPTZ(6),
    CONSTRAINT "job_run_details_pkey" PRIMARY KEY ("runid")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "userid" TEXT NOT NULL,
    "data" TEXT,
    "code" TEXT,
    "activatedcode" TEXT,
    "activationtimestamp" TEXT,
    "username" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "nbcodecalled" INTEGER NOT NULL DEFAULT 0,
    "nbverifycalled" INTEGER NOT NULL DEFAULT 0,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6),
    "isdeleted" TIMESTAMP(6),
    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobname_username_uniq" ON "cron"."job"("jobname", "username");

-- CreateIndex
CREATE UNIQUE INDEX "users_data_key" ON "public"."users"("data");
