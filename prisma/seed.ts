import { PrismaClient } from '@prisma/client'

const database = new PrismaClient();

async function main() {
    database.job.upsert({
        where: { jobid: 1 },
        create: { jobid: 1, schedule: '0 0 * * *', command: 'DELETE FROM Users WHERE isDeleted IS NOT NULL AND isDeleted < NOW() - INTERVAL \'6 months\'' },
        update: { schedule: '0 0 * * *', command: 'DELETE FROM Users WHERE isDeleted IS NOT NULL AND isDeleted < NOW() - INTERVAL \'6 months\'' }
    });
}

main()
    .then(async () => {
        await database.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await database.$disconnect();
        process.exit(1);
    });
