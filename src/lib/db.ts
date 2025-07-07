
'use server';

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import type { User } from './types';

// The default users to seed the database with on first run.
const defaultUsers: Pick<User, 'username' | 'password'>[] = [
    { username: 'admin', password: 'password' },
    { username: 'cajero1', password: 'password123' },
    { username: 'cajero2', password: 'password456' },
];

let dbPromise: Promise<Database> | null = null;

const initializeDb = async () => {
    const db = await open({
        filename: './cafe_central.db',
        driver: sqlite3.verbose().Database,
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `);

    const usersCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (usersCount && usersCount.count === 0) {
        console.log('Seeding database with default users...');
        const stmt = await db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        for (const user of defaultUsers) {
             if(user.username && user.password) {
                await stmt.run(user.username, user.password);
             }
        }
        await stmt.finalize();
    }
    return db;
};

export function getDbConnection() {
    if (!dbPromise) {
        dbPromise = initializeDb();
    }
    return dbPromise;
}
