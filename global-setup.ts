import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const STORAGE_STATE_PATH = path.resolve(
  __dirname,
  process.env.STORAGE_STATE_PATH || '.auth/storageState.json'
);

/**
 * Logs into the ServiceNow instance once and stores the browser session so the
 * tests do not log in again. Fails loudly: a silent auth failure would turn a
 * quality gate into a false pass or a confusing downstream error.
 */
export default async function globalSetup(_config: FullConfig): Promise<void> {
  const baseURL = process.env.SN_DEV_INSTANCE || process.env.SN_INSTANCE_URL;
  const username = process.env.SN_DEV_USER || process.env.SN_USERNAME;
  const password = process.env.SN_DEV_PASS || process.env.SN_PASSWORD;

  if (!baseURL || !username || !password) {
    throw new Error(
      'Missing SN_DEV_INSTANCE, SN_DEV_USER or SN_DEV_PASS. Set them in .env (local) or as GitHub environment secrets (CI).'
    );
  }

  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });

  const browser = await chromium.launch({
    channel: process.env.CI ? undefined : 'chrome',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(90_000);
  page.setDefaultTimeout(90_000);

  try {
    await page.goto(`${baseURL}/login.do`, { waitUntil: 'domcontentloaded' });
    await page.locator('#user_name').fill(username);
    await page.locator('#user_password').fill(password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load', timeout: 60_000 }).catch(() => {}),
      page.locator('#sysverb_login').click()
    ]);

    if (page.url().includes('login.do')) {
      throw new Error(`Login failed: still on the login page (${page.url()})`);
    }

    await context.storageState({ path: STORAGE_STATE_PATH });
  } finally {
    await context.close();
    await browser.close();
  }
}
