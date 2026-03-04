const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

// Create express application
const app = express();
app.use(cors());
app.use(express.json());

// Configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD, // Use environment variable for the DB password
    database: 'mydb'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Sample GET route
app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM data', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Sample POST route
app.post('/api/data', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO data (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, name });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});