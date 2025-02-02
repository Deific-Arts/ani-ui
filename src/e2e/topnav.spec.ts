import { expect, Page, test } from '@playwright/test';
import { describe } from 'node:test';
import { users } from './utilities';

describe('Top Nav: Unauthenticated', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('has all tab on home page', async ({ page }) => {
    await page.goto('/home');
    page.getByText('All')
  });

  test('displays call to membership when searched is clicked', async ({ page }) => {
    await page.goto('/home');
    const buttonText = 'Login to become a member';
    await expect(page.getByText(buttonText)).not.toBeVisible();
    const button = page.getByRole('button', { name: 'Search' });
    await button.press('Enter');
    await expect(page.getByText(buttonText)).toBeVisible();
  });

  test('login button takes you to the login page', async ({ page }) => {
    await page.goto('/home');
    const button = page.getByRole("button", { name: 'Login' });
    await button.press('Enter');
    await expect(page.url()).toContain('/login');
  });

  test('logo takes you to the home page', async ({ page }) => {
    await page.goto('/login');
    const logo = page.getByRole('button', { name: 'Home' });
    await logo.press('Enter');
    expect(page.url()).toContain('/home');
  });
});

describe('Top Nav: Authenticated', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // login
    await page.goto('/login');
    await page.waitForTimeout(1000);

    const username = page.locator('[action="api/auth/local"] input[name=identifier]');
    const password = page.locator('[action="api/auth/local"] input[name=password]');
    const button = page.getByRole('button', { name: 'Login' });

    await username.fill(users.standard.name);
    await password.fill(users.standard.pass);
    await button.press('Enter');
    await page.waitForTimeout(1000);
  });

  test('should display an avatar', async () => {
    await page.goto('/home');
    const avatar = page.getByAltText(users.standard.name);
    expect(avatar).toBeVisible();
  });

  test('avatar should take user to profile on click', async () => {
    await page.goto('/home');
    const button = page.getByRole('button', { name: 'Profile Avatar' });
    await button.press('Enter');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/profile');
  });

  test('clicking search should display membership cta', async () => {
    await page.goto('/home');
    const searchText = 'Want to be able to easily search quotes by content, author, or book?';
    await expect(page.getByText(searchText)).not.toBeVisible();
    const button = page.getByRole('button', { name: 'Search' });
    await button.press('Enter');
    await expect(page.getByText(searchText)).toBeVisible();
  });
});

describe('Top Nav: Member', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // login
    await page.goto('/login');
    await page.waitForTimeout(1000);

    const username = page.locator('[action="api/auth/local"] input[name=identifier]');
    const password = page.locator('[action="api/auth/local"] input[name=password]');
    const button = page.getByRole('button', { name: 'Login' });

    await username.fill(users.member.name);
    await password.fill(users.member.pass);
    await button.press('Enter');
    await page.waitForTimeout(1000);
  });

  test('clicking search should allow member to search', async () => {
    await page.goto('/home');
    // const searchText = 'Want to be able to easily search quotes by content, author, or book?';
    // await expect(page.getByText(searchText)).not.toBeVisible();
    const button = page.getByRole('button', { name: 'Search' });
    await button.press('Enter');
    await expect(page.getByText('Search by content, book, or user')).toBeVisible();
    const searchInput = page.locator('input[name=search]');
    await searchInput.fill('search');
    searchInput.blur();
    await expect(page.getByText(/We could not find any quotes/)).toBeVisible();
  });
});
