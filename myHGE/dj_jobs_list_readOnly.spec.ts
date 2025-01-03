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

test.describe('Select Job Page', () => {

  // Runs before each test
  test.beforeEach(async ({ page }) => {
      // Get session ID from auth.json
      const sessionId = getSessionIdFromAuth();
  
      // Construct the target URL
      const targetUrl = `${baseUrl}jobs/list/867820208`;
  
      // Navigate to the constructed URL
      await page.goto(targetUrl);
      await page.reload();
      await expect(page.locator('h2')).toContainText('Jobs List');
    });


  test('should display the filter dropdown with all options (Any, After, Before, Between)', async ({ page }) => {
    await page.getByRole('button', { name: 'filter_alt' }).click();
    // Locate the dropdown
    const filterDropdown = page.locator('select');
    const filterButton = page.locator('button:has-text("Sold Date")');

    // Open the dropdown and verify options
    await filterDropdown.click();
    const dropdownOptions = filterDropdown.locator('option');
    await expect(dropdownOptions).toContainText(['Any', 'After', 'Before', 'Between']);
  });

  test('Test Pagination: Going to 2nd page', async ({ page }) => {
    if(await expect(page.getByRole('main')).toContainText('2')) {
      await page.getByRole('link', { name: '2', exact: true }).click();
      await expect(page.locator('h2')).toContainText('Jobs List');
    }
  });

  test('should navigate to user job list page upon clicking the Return to Users List link', async ({ page }) => {
    // For example, we pick the Scheduler, Account
    await page.getByRole('link', { name: 'Return to Users List' }).click();

    // Validate we navigated to the correct page (for example, using the URL or a heading)
    await expect(page).toHaveURL(/\/jobs\/list\/\d+$/);
    await expect(page).toHaveTitle(/Select Division/i);
  });
});