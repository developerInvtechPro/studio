
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import type { User, Category, Product, Table } from './types';

// The default data to seed the database with on first run.
const defaultUsers: Pick<User, 'username' | 'password'>[] = [
    { username: 'admin', password: 'password' },
    { username: 'cajero1', password: 'password123' },
    { username: 'cajero2', password: 'password456' },
];

const defaultCategories = [
  { id: 1, name: 'Coffee', iconName: 'Coffee' },
  { id: 2, name: 'Pastries', iconName: 'Cookie' },
  { id: 3, name: 'Sandwiches', iconName: 'Sandwich' },
  { id: 4, name: 'Drinks', iconName: 'GlassWater' },
  { id: 5, name: 'Salads', iconName: 'Salad' },
  { id: 6, name: 'Soups', iconName: 'Soup' },
  { id: 7, name: 'Desserts', iconName: 'CakeSlice' },
  { id: 8, name: 'Frappes', iconName: 'IceCream2' },
  { id: 9, name: 'Sides', iconName: 'UtensilsCrossed' },
  { id: 10, name: 'Smoothies', iconName: 'Milk' },
  { id: 11, name: 'Teas', iconName: 'Leaf' },
  { id: 12, name: 'Specials', iconName: 'Star' },
  { id: 13, name: 'Breakfast', iconName: 'Egg' },
  { id: 14, name: 'Combos', iconName: 'Utensils' },
  { id: 15, name: 'Alcohol', iconName: 'Wine' },
  { id: 16, name: 'Vegan', iconName: 'Vegan' },
];

const defaultProducts: Omit<Product, 'icon'>[] = [
  { id: 1, name: 'Espresso', price: 2.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'espresso shot' },
  { id: 2, name: 'Latte', price: 3.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'latte art' },
  { id: 3, name: 'Cappuccino', price: 3.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cappuccino foam' },
  { id: 4, name: 'Americano', price: 3.0, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'black coffee' },
  { id: 5, name: 'Mocha', price: 4.0, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate coffee' },
  { id: 6, name: 'Croissant', price: 2.0, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'buttery croissant' },
  { id: 7, name: 'Muffin', price: 2.5, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'blueberry muffin' },
  { id: 8, name: 'Cinnamon Roll', price: 3.0, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced cinnamon' },
  { id: 11, name: 'Turkey Club', price: 7.5, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'turkey sandwich' },
  { id: 12, name: 'Ham & Cheese', price: 6.5, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'ham cheese' },
  { id: 15, name: 'Orange Juice', price: 3.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'fresh juice' },
  { id: 16, name: 'Iced Tea', price: 2.5, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced tea' },
  { id: 19, name: 'Caesar Salad', price: 8.0, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'caesar salad' },
  { id: 21, name: 'Tomato Soup', price: 5.0, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tomato soup' },
  { id: 23, name: 'Cheesecake', price: 4.5, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'slice cheesecake' },
  { id: 25, name: 'Caramel Frappe', price: 4.5, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'caramel frappe' },
  { id: 27, name: 'French Fries', price: 3.0, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'french fries' },
  { id: 29, name: 'Strawberry Banana', price: 5.0, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'strawberry smoothie' },
  { id: 31, name: 'Green Tea', price: 2.5, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'green tea' },
  { id: 33, name: 'Daily Special', price: 9.0, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'daily special' },
  { id: 35, name: 'Breakfast Burrito', price: 6.0, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'breakfast burrito' },
  { id: 37, name: 'Coffee & Croissant', price: 4.0, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'coffee croissant' },
  { id: 39, name: 'Beer (Local)', price: 5.0, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'craft beer' },
  { id: 41, name: 'Vegan Wrap', price: 7.0, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegan wrap' },
];

const defaultTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Mesa ${i + 1}`,
  status: 'available',
}));


let dbPromise: Promise<Database> | null = null;

const initializeDb = async () => {
    const db = await open({
        filename: './cafe_central.db',
        driver: sqlite3.verbose().Database,
    });

    await db.exec('PRAGMA foreign_keys = ON;');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            icon_name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category_id INTEGER NOT NULL,
            image_url TEXT,
            image_hint TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE TABLE IF NOT EXISTS tables (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            status TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT,
            starting_cash REAL NOT NULL,
            ending_cash REAL,
            is_active BOOLEAN NOT NULL DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shift_id INTEGER NOT NULL,
            table_id INTEGER,
            customer_name TEXT,
            subtotal REAL NOT NULL,
            tax_amount REAL NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (shift_id) REFERENCES shifts(id),
            FOREIGN KEY (table_id) REFERENCES tables(id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price_at_time REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `);
    
    // Seed database if empty
    const usersCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (usersCount && usersCount.count === 0) {
        console.log('Seeding database with default data...');
        const userStmt = await db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        for (const user of defaultUsers) {
            await userStmt.run(user.username, user.password);
        }
        await userStmt.finalize();
        
        const catStmt = await db.prepare('INSERT INTO categories (id, name, icon_name) VALUES (?, ?, ?)');
        for (const cat of defaultCategories) {
            await catStmt.run(cat.id, cat.name, cat.iconName);
        }
        await catStmt.finalize();

        const prodStmt = await db.prepare('INSERT INTO products (id, name, price, category_id, image_url, image_hint) VALUES (?, ?, ?, ?, ?, ?)');
        for (const prod of defaultProducts) {
            await prodStmt.run(prod.id, prod.name, prod.price, prod.categoryId, prod.imageUrl, prod.imageHint);
        }
        await prodStmt.finalize();

        const tableStmt = await db.prepare('INSERT INTO tables (id, name, status) VALUES (?, ?, ?)');
        for (const table of defaultTables) {
            await tableStmt.run(table.id, table.name, table.status);
        }
        await tableStmt.finalize();
    }
    
    return db;
};

export function getDbConnection() {
    if (!dbPromise) {
        dbPromise = initializeDb();
    }
    return dbPromise;
}
