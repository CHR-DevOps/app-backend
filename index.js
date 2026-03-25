require('dotenv').config();
const mysql = require('mysql');
const createApp = require('./app');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mydb',
});

function ensureSchema(connection) {
  return new Promise((resolve, reject) => {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    connection.query(createTableSql, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

db.connect(async (err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }

  console.log('Connected to MySQL Database');

  try {
    await ensureSchema(db);
    console.log('Database schema is ready');
  } catch (schemaErr) {
    console.error('Error ensuring database schema:', schemaErr);
    process.exit(1);
  }

  const app = createApp(db);
  const PORT = process.env.PORT || 5000;

  app.get('/health', (req, res) => {
    res.status(200).send('ok');
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'backend',
      color: process.env.COLOR || 'unknown',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});