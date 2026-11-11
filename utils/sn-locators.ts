import type { Locator, Page } from '@playwright/test';

/**
 * Resolves a selector in both Classic UI (inside the #gsft_main iframe) and
 * Next Experience / Workspace (top-level DOM), so one test works in either.
 */
export function snLocator(page: Page, selector: string): Locator {
  return page.frameLocator('#gsft_main').locator(selector).or(page.locator(selector));
}
