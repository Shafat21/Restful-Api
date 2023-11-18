const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
const server = "http://localhost:";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restapiexpress',
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
app.post('/api/signup', (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error('Error generating salt: ' + err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password: ' + err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Database error: ' + err);
                    return res.status(500).json({ message: 'Database error' });
                } else {
                    return res.status(201).json({ message: 'User registered successfully' });
                }
            });
        });
    });
});

app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            res.status(500).send('Database error');
        } else if (results.length === 0) {
            res.status(401).send('User not found');
        } else {
            const user = results[0];
            if (user.password === password) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Incorrect password');
            }
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}. Open ${server}${port}/`);
});