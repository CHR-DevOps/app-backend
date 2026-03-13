// Playwright config for backend
module.exports = {
  testDir: './tests',
  webServer: {
    command: 'node index.js',
    port: 5000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5000',
    headless: true,
  },
};