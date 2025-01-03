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

test.describe('Select User Page', () => {

  // Runs before each test
  test.beforeEach(async ({ page }) => {
      // Get session ID from auth.json
      const sessionId = getSessionIdFromAuth();
  
      // Construct the target URL
      const targetUrl = `${baseUrl}jobs/filter/709055460`;
  
      // Navigate to the constructed URL
      await page.goto(targetUrl);
      await page.reload();
      await expect(page.locator('h2')).toContainText('Mid-Atlantic');
    });


  test('should display the correct page title and heading', async ({ page }) => {
    // Check for an expected page title
    await expect(page).toHaveTitle(/Users/i);

    // Check for an expected heading
    const heading = page.locator('h2');
    await expect(heading).toContainText('Mid-Atlantic');
  });

  test('should display the filter dropdown with all options (All, Active, Inactive)', async ({ page }) => {
    // Locate the dropdown
    const filterDropdown = page.locator('#is-inactive');
    await expect(filterDropdown).toBeVisible();

    // Open the dropdown and verify options
    await filterDropdown.click();
    const dropdownOptions = filterDropdown.locator('option');
    await expect(dropdownOptions).toContainText(['All', 'Active', 'Inactive']);
  });

  test('should display the users list by default', async ({ page }) => {
    // Check that the division list is visible
    const divisionList = page.locator('table tr'); // or if it’s a list: page.locator('ul li'), etc.
    // Expect at least one division to be displayed
    await expect(page.locator('tbody')).toContainText('Scheduler, Account');
  });

  test('should filter the users when "Active" is selected', async ({ page }) => {
    const filterDropdown = page.locator('#is-inactive');
    const filterButton = page.locator('button:has-text("Filter")');

    // Select 'Active'
    await filterDropdown.selectOption({ label: 'Active' });
    await page.getByRole('button', { name: 'Filter' }).click();

    // Check that the list only contains active divisions
    await expect(page.locator('tbody')).not.toContainText('Boone, Alphonzo');
    await expect(page.locator('tbody')).toContainText('Scheduler, Account');
  });

  test('should filter the divisions when "Inactive" is selected', async ({ page }) => {
    const filterDropdown = page.locator('#is-inactive');
    const filterButton = page.locator('button:has-text("Filter")');

    // Select 'Inactive'
    await filterDropdown.selectOption({ label: 'Inactive' });
    await page.getByRole('button', { name: 'Filter' }).click();

    // Check that the list only contains inactive divisions
    await expect(page.locator('tbody')).toContainText('Boone, Alphonzo');
    await expect(page.locator('tbody')).not.toContainText('Scheduler, Account');
  });

  test('should display all divisions when "All" is selected', async ({ page }) => {
    const filterDropdown = page.locator('#is-inactive');
    const filterButton = page.locator('button:has-text("Filter")');

    // Select 'All'
    await filterDropdown.selectOption({ label: 'All' });
    await page.getByRole('button', { name: 'Filter' }).click();

    // Check that both active and inactive items are displayed
    await expect(page.locator('tbody')).toContainText('Boone, Alphonzo');
    await expect(page.locator('tbody')).toContainText('Scheduler, Account');
  });

  test('should navigate to a specific user page upon clicking a division link', async ({ page }) => {
    // For example, we pick the Scheduler, Account
    await page.getByRole('link', { name: 'Scheduler, Account' }).click();

    // Validate we navigated to the correct page (for example, using the URL or a heading)
    await expect(page).toHaveURL(/\/jobs\/list\/\d+$/);
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Account Scheduler');
  });

  test('should navigate to division page upon clicking the Return to Division List link', async ({ page }) => {
    // For example, we pick the Scheduler, Account
    await page.getByRole('link', { name: 'Return to Division List' }).click();

    // Validate we navigated to the correct page (for example, using the URL or a heading)
    await expect(page).toHaveURL(/\/jobs\/filter/);
    await expect(page.locator('h2')).toContainText('Jobs List');
  });
});