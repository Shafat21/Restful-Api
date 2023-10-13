const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(bodyParser.json());
const server = "http://localhost:";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restapiexpress', // Use the correct database name you created
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err);
        return;
    }
    console.log('Connected to the SQL Database');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/resource', (req, res) => {
    db.query('SELECT * FROM resources', (err, results) => {
        if (err) {
            res.status(500).send('Database error');
        } else {
            const data = {};
            results.forEach((row) => {
                data[row.key_name] = row.value;
            });
            res.json(data);
        }
    });
});

app.post('/api/resource/:key', (req, res) => {
    const key = req.params.key;
    const value = req.body.value;

    db.query('INSERT INTO resources (key_name, value) VALUES (?, ?)', [key, value], (err) => {
        if (err) {
            res.status(500).send('Database error');
        } else {
            res.json({
                [key]: value
            });
        }
    });
});

app.put('/api/resource/:key', (req, res) => {
    const key = req.params.key;
    const value = req.body.value;

    db.query('UPDATE resources SET value = ? WHERE key_name = ?', [value, key], (err, results) => {
        if (err) {
            res.status(500).send('Database error');
        } else if (results.affectedRows === 1) {
            res.json({
                [key]: value
            });
        } else {
            res.status(404).send('Resource not found');
        }
    });
});

app.delete('/api/resource/:key', (req, res) => {
    const key = req.params.key;
    db.query('DELETE FROM resources WHERE key_name = ?', [key], (err, results) => {
        if (err) {
            res.status(500).send('Database error');
        } else if (results.affectedRows === 1) {
            res.send('Resource deleted');
        } else {
            res.status(404).send('Resource not found');
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}. Open ${server}${port}/`);
});
