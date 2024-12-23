import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dev.myhge.com/');
  await page.getByPlaceholder('Username').fill('kcorros');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('x3ykx57v');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('link', { name: 'Add User' }).click();
});