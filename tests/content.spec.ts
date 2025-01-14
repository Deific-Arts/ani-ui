import { test } from '@playwright/test';

test('has all tab', async ({ page }) => {
  await page.goto('/home');
  page.getByText('All')
});
