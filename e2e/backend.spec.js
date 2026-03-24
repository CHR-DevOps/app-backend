const { test, expect, request } = require('@playwright/test');

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5000';
const apiUrl = `${BASE_URL}/api/data`;

test('GET /api/data returns list', async () => {
  const context = await request.newContext();
  const res = await context.get(apiUrl);

  expect(res.status()).toBe(200);

  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
});


test('POST /api/data inserts and returns created object', async () => {
  const context = await request.newContext();

  // current date
  const now = new Date();
  const dateString = now.toISOString();
  // ex: 2026-03-24T12:45:33.123Z

  const userName = `PlaywrightUser_${dateString}`;

  const res = await context.post(apiUrl, {
    data: { name: userName }
  });

  expect(res.status()).toBe(201);

  const body = await res.json();

  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('name', userName);

  console.log("Created user:", userName);
});