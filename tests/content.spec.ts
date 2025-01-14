import { test } from '@playwright/test';

test('has all tab', async ({ page }) => {
  await page.goto('http://localhost:5174/home');
  page.getByText('All')
});
