const express = require('express');
const cors = require('cors');

function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM data', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  app.post('/api/data', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO data (name) VALUES (?)', [name], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, name });
    });
  });

  return app;
}

module.exports = createApp;
