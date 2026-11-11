import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export const STORAGE_STATE = path.resolve(
  __dirname,
  process.env.STORAGE_STATE_PATH || '.auth/storageState.json'
);

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  // ServiceNow copes best with a single active session; run sequentially.
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 1,
  fullyParallel: false,

  timeout: parseInt(process.env.TIMEOUT_SECONDS ?? '90', 10) * 1_000,
  expect: { timeout: 15_000 },
  retries: process.env.RETRIES ? parseInt(process.env.RETRIES, 10) : isCI ? 1 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],

  use: {
    headless: process.env.HEADLESS !== 'false',
    baseURL: process.env.SN_DEV_INSTANCE || process.env.SN_INSTANCE_URL,
    storageState: STORAGE_STATE,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    navigationTimeout: 60_000,
    actionTimeout: 30_000
  },

  globalSetup: './global-setup.ts',

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // CI installs Playwright's own Chromium; locally use installed Chrome.
        channel: isCI ? undefined : 'chrome'
      }
    }
  ]
});
