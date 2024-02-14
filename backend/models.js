const sqlite3 = require('sqlite3').verbose();

const dbPath = './veritabani.db';
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('SQLite veritabanı bağlantısı başarıyla kapatıldı.');
    }
});
