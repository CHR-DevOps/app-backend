// Playwright config for backend
const isRemote = !!process.env.PLAYWRIGHT_BASE_URL;

module.exports = {
  testDir: './e2e',
  webServer: isRemote
    ? undefined
    : {
        command: 'node index.js',
        port: 5000,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
      },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5000',
    headless: true,
  },
};