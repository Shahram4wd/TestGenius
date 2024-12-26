import {test, expect} from "@playwright/test"
import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the specified path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

if (!username || !password) {
  throw new Error('Missing USERNAME or PASSWORD environment variables');
}

console.log('Username and password loaded from environment variables.');

//export { username, password };

test('login setup', async ({ page }) => {
  await page.goto('https://staging.myhge.com/');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboards' })).toBeVisible();
  await page.context().storageState({path: "./playwright/.auth/auth.json"})
});