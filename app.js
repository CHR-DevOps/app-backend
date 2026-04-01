const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
      end({ method: req.method, route: req.path, status_code: res.statusCode });
    });
    next();
  });

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

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
