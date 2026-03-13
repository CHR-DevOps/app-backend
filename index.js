require('dotenv').config();
const mysql = require('mysql');
const createApp = require('./app');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mydb'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL Database');

  const app = createApp(db);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});