import Bun from 'bun';

const PLAYER_ID = 0;

async function getDatabase() {
    const dbFile = Bun.file(process.env.DATABASE_PATH!);
    return await dbFile.json();
}

async function updateDatabase(database: any) {
    const dbFile = Bun.file(process.env.DATABASE_PATH!);
    const updatedJson = JSON.stringify(database, null, 4);
    await Bun.write(dbFile, updatedJson);
}

export {
    PLAYER_ID,
    getDatabase,
    updateDatabase
}