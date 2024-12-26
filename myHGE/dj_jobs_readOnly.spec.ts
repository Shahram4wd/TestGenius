import {test, expect} from "@playwright/test"
import fs from 'fs';
import path from 'path';

function getSessionIdFromAuth(): string {
  // Construct the path to auth.json
  const authPath = path.join(__dirname, '../playwright/.auth/auth.json');

  // Read and parse the auth.json file
  const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'));

  // Find the session ID from the cookies
  const sessionCookie = authData.cookies.find(
    (cookie: { name: string }) => cookie.name === 'hge_stage_session_id'
  );

  if (!sessionCookie || !sessionCookie.value) {
    throw new Error('Session ID not found in auth.json');
  }

  // Remove quotes from the session ID if necessary
  return sessionCookie.value.replace(/"/g, '');
}

// Define the base URL
const baseUrl = 'https://stagedj.myhge.com/';

test.beforeEach(async ({ page }) => {
  // Get session ID from auth.json
  const sessionId = getSessionIdFromAuth();

  // Construct the target URL
  const targetUrl = `${baseUrl}jobs/filter`;

  // Navigate to the constructed URL
  await page.goto(targetUrl);
});

test('Select Division', async ({ page }) => {
  await expect(page.locator('tbody')).toContainText('Mid-Atlantic');
  await page.locator('#is-inactive').selectOption('1');
  await page.getByRole('button', { name: 'Filter' }).click();
  await expect(page.locator('tbody')).toContainText('Tidewater-old');
  await page.locator('#is-inactive').selectOption('');
  await page.getByRole('button', { name: 'Filter' }).click();
  await expect(page.locator('tbody')).toContainText('info');
  await expect(page.locator('tbody')).toContainText('Charlotte');
  await page.locator('#is-inactive').selectOption('0');
  await page.getByRole('button', { name: 'Filter' }).click();
  await expect(page.locator('tbody')).toContainText('Altoona');
});

test('Job View Door', async ({ page }) => {
  await page.reload();
  await page.getByRole('link', { name: 'Mid-Atlantic' }).click();
  await page.getByRole('link', { name: 'Scheduler, Account' }).click();
  await page.getByRole('link', { name: 'Lafavors, Brandon' }).click();
  await expect(page.locator('h2')).toContainText('Oh Noes!');
});
