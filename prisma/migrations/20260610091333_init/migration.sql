-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- CreateTable
CREATE TABLE "users" (
    "userid" TEXT NOT NULL,
    "data" TEXT,
    "code" TEXT,
    "activatedCode" TEXT,
    "activationTimestamp" INTEGER,
    "username" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "nbCodeCalled" INTEGER NOT NULL DEFAULT 0,
    "nbVerifyCalled" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "isDeleted" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "guild_configurations" (
    "guildid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guild_configurations_pkey" PRIMARY KEY ("guildid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_data_key" ON "users"("data");
