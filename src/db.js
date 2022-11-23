import Dexie from "dexie";

const db = new Dexie('notes-database');
db.version(1).stores({
    notesdb: '++id, value',
});

export const {notesdb} = db;
