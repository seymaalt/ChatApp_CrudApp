const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3005;
const cors = require('cors');

const dbPath = './veritabani.db';
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/categories', (req, res) => {
    db.all('SELECT * FROM categories', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ categories: rows });
    });
});

app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ products: rows });
    });
});

app.post('/categories', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Kategori adı girilmelidir." });
    }

    db.run('INSERT INTO categories (name) VALUES (?)', [name], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Kategori başarıyla oluşturuldu.", categoryId: this.lastID });
    });
});

app.post('/products', (req, res) => {
    const { name, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
        return res.status(400).json({ error: "Ürün adı, fiyat ve kategori idsi girilmelidir." });
    }

    db.run('INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)', [name, price, categoryId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Ürün başarıyla oluşturuldu.", productId: this.lastID });
    });
});

app.delete('/categories/:id', (req, res) => {
    const categoryId = req.params.id;

    db.run('DELETE FROM categories WHERE id = ?', categoryId, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Silinecek kategori bulunamadı." });
        }

        res.json({ message: "Kategori başarıyla silindi." });
    });
});

app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;

    db.run('DELETE FROM products WHERE id = ?', productId, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Silinecek ürün bulunamadı." });
        }

        res.json({ message: "Ürün başarıyla silindi." });
    });
});

app.put('/categories/:id', (req, res) => {
    const categoryId = req.params.id;
    const newName = req.body.name;

    if (!newName) {
        return res.status(400).json({ error: "Güncellenecek kategori adı girilmelidir." });
    }

    db.run('UPDATE categories SET name = ? WHERE id = ?', [newName, categoryId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Güncellenecek kategori bulunamadı." });
        }

        res.json({ message: "Kategori başarıyla güncellendi." });
    });
});

app.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
        return res.status(400).json({ error: "Güncellenecek ürün adı, fiyat ve kategori idsi girilmelidir." });
    }

    db.run('UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?', [name, price, categoryId, productId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Güncellenecek ürün bulunamadı." });
        }

        res.json({ message: "Ürün başarıyla güncellendi." });
    });
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
