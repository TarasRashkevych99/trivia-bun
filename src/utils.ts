import Bun from 'bun';

const PLAYER_ID = 0;
const DATABASE_PATH = "database.json"

async function getDatabase() {
    const dbFile = Bun.file(DATABASE_PATH);
    return await dbFile.json();
}

async function updateDatabase(database: any) {
    const dbFile = Bun.file(DATABASE_PATH);
    const updatedJson = JSON.stringify(database, null, 4);
    await Bun.write(dbFile, updatedJson);
}

function getTimestamp(){
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
}

export {
    PLAYER_ID,
    getDatabase,
    updateDatabase,
    getTimestamp
}