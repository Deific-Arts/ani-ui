import { expect, Locator, Page, test } from '@playwright/test';
import { describe } from 'node:test';
// import { users } from './utilities';

describe('Top Nav: Unauthenticated', () => {
  let page: Page;
  let loginText: Locator;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    loginText = page.getByText('Want to join in on the fun? Login now!');
  });

  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await page.goto('/home');
  });

  test('has all tab on home page', async () => {
    page.getByText('All')
  });

  test('clicking on comments should show login modal', async () => {
    const comment = page.getByRole('button', { name: 'Comments' }).first();
    await expect(loginText).not.toBeVisible();
    await comment.press('Enter');
    await page.waitForTimeout(5000);
    await expect(loginText).toBeVisible();
  });

  test('clicking on re-quotes should show login modal', async () => {
    const requote = page.getByRole('button', { name: 'Requote' }).first();
    await expect(loginText).not.toBeVisible();
    await requote.press('Enter');
    await expect(loginText).toBeVisible();
  });

  test('clicking on like should show login modal', async () => {
    const like = page.getByRole('button', { name: 'Like' }).first();
    await expect(loginText).not.toBeVisible();
    await like.press('Enter');
    await expect(loginText).toBeVisible();
  });
});
