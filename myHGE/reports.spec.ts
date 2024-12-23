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
    (cookie: { name: string }) => cookie.name === 'hge_dev_session_id'
  );

  if (!sessionCookie || !sessionCookie.value) {
    throw new Error('Session ID not found in auth.json');
  }

  // Remove quotes from the session ID if necessary
  return sessionCookie.value.replace(/"/g, '');
}

// Define the base URL
const baseUrl = 'https://dev.myhge.com/secure/';

test.beforeEach(async ({ page }) => {
  // Get session ID from auth.json
  const sessionId = getSessionIdFromAuth();

  // Construct the target URL
  const targetUrl = `${baseUrl}${sessionId}/Reports/index_html`;

  // Navigate to the constructed URL
  await page.goto(targetUrl);
});

test('reports change order', async ({ page }) => {
  await page.getByRole('link', { name: 'All' }).click();
  await page.getByRole('link', { name: 'Change Orders' }).click();
  await page.locator('#start-date').fill('2024-11-01');
  await page.locator('#end-date').fill('2024-11-30');
  await page.getByRole('button', { name: 'Filter' }).click();

  await expect(page.locator('tbody')).toContainText('Shaw, Kirk');
  await expect(page.locator('tbody')).toContainText('Tidewater');
  await expect(page.locator('tbody')).toContainText('11/18/2024');
  await expect(page.locator('tbody')).toContainText('Sold');
  await expect(page.locator('tbody')).toContainText('n/a');
  await expect(page.locator('tbody')).toContainText('$-30.00');
  await expect(page.locator('tbody')).toContainText('Sales Rep Self Sourced');
  await expect(page.locator('tbody')).toContainText('Parker, Nicholas');
  await expect(page.locator('tbody')).toContainText('True-Up Adjustment');
  await expect(page.locator('tbody')).toContainText('Per Install, charge for cancelling a check.');
});

test('report nationwide', async ({ page }) => {
  await page.getByRole('link', { name: 'All' }).click();
  await page.getByRole('link', { name: 'Revenue Report' }).first().click();
  await page.locator('#start-date').fill('2024-11-01');
  await page.locator('#end-date').fill('2024-11-30');
  await page.getByRole('button', { name: 'Filter' }).click();
  
  await expect(page.locator('tfoot')).toContainText('$17,549,217.58');
});