const request = require('supertest');
const createApp = require('../app');

describe('Backend API', () => {
  let app;

  beforeEach(() => {
    const mockDb = {
      query: (sql, params, cb) => {
        if (typeof params === 'function') {
          cb = params;
        }
        if (sql.startsWith('SELECT')) {
          return cb(null, [{ id: 1, name: 'Alice' }]);
        }
        if (sql.startsWith('INSERT')) {
          return cb(null, { insertId: 42 });
        }
        return cb(null, []);
      }
    };
    app = createApp(mockDb);
  });

  test('GET /api/data returns list', async () => {
    const res = await request(app).get('/api/data');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Alice' }]);
  });

  test('POST /api/data inserts and returns created object', async () => {
    const res = await request(app).post('/api/data').send({ name: 'Bob' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 42, name: 'Bob' });
  });
});
