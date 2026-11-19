
// @ts-check
import './config/env.js';
import { defineConfig, devices } from '@playwright/test';
import { ROLES, authFile } from './config/roles.js';

/**
 * Konfigurasi Playwright
 * @see https://playwright.dev/docs/test-configuration
 */

// Browser yang dites
const BROWSERS = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
    grepInvert: /@flow/,
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
    grepInvert: /@flow/,
  },
];

// Konfigurasi project berdasarkan role
const projects = ROLES.length
  ? [
      // Login check
      {
        name: 'login-check',
        testDir: './tests/login-check',
        use: { ...devices['Desktop Chrome'] },
      },

      // Satu project per role dan browser
      ...ROLES.flatMap((role) =>
        BROWSERS.map((browser) => ({
          name: `${role}-${browser.name}`,
          testDir: `./tests/${role}`,
          use: {
            ...browser.use,
            storageState: authFile(role),
          },
          grepInvert: browser.grepInvert,
        }))
      ),

      // Public project
      ...BROWSERS.map((browser) => ({
        name: `public-${browser.name}`,
        testDir: './tests/public',
        use: browser.use,
        grepInvert: browser.grepInvert,
      })),
    ]
  : BROWSERS.map((browser) => ({
      name: browser.name,
      use: browser.use,
      grepInvert: browser.grepInvert,
    }));

// Konfigurasi utama Playwright
export default defineConfig({
  timeout: 60_000,

  globalSetup: 'config/globalSetup.js',

  testDir: './tests',

  // Eksekusi test satu per satu
  fullyParallel: false,
  workers: 1,

  // Pengaturan CI
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // HTML Reporter bawaan Playwright
  reporter: 'html',

  // Pengaturan browser
  use: {
    baseURL: process.env.WEB_URL,
    video: 'on',
    trace: 'on-first-retry',
  },

  // Project
  projects,
});
