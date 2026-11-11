import { test, expect } from '@playwright/test';

test.describe('smoke @smoke', () => {
  test('instance is reachable and the session is authenticated', async ({ page }) => {
    await page.goto('/now/nav/ui/home', { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/login\.do/);
  });

  test('deployed app route responds', async ({ page }) => {
    // /aiux/<basename>/home is the app landing route (aiux.json basename).
    const response = await page.goto('/aiux/claudelearningportal/home', {
      waitUntil: 'domcontentloaded'
    });
    expect(response, 'no response from the app route').not.toBeNull();
    expect(response!.status(), 'app route returned an error status').toBeLessThan(400);
    await expect(page).not.toHaveURL(/login\.do/);
  });
});
