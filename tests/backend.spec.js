const { test, expect, request } = require('@playwright/test');

const apiUrl = 'http://localhost:5000/api/data';

test('GET /api/data returns list', async () => {
  const context = await request.newContext();
  const res = await context.get(apiUrl);
  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
});

test('POST /api/data inserts and returns created object', async () => {
  const context = await request.newContext();
  const res = await context.post(apiUrl, {
    data: { name: 'PlaywrightUser' }
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('name', 'PlaywrightUser');
});