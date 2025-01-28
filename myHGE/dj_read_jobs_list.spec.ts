import {test, expect} from "@playwright/test"
import { Console } from "console";
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

test.describe('Select Job Page', () => {

  // Runs before each test
  test.beforeEach(async ({ page }) => {
      // Get session ID from auth.json
      const sessionId = getSessionIdFromAuth();
  
      // Construct the target URL
      const targetUrl = `./jobs/list/867820208`;
  
      // Navigate to the constructed URL
      await page.goto(targetUrl);
      await page.reload();
      await expect(page.locator('h2')).toContainText('Jobs List');
      await page.getByRole('button', { name: 'filter_alt' }).click();
      await page.getByRole('radio', { name: 'Any' }).check();
      await page.getByRole('button', { name: 'Filter', exact: true }).click();
      await page.getByRole('link', { name: 'Contract', exact: true }).click();
      await expect(page.locator('tbody')).toContainText('Parker, Melanie');
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

  test('Test Pagination: Going to page numbers page', async ({ page }) => {
    await page.getByRole('link', { name: '2', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Barber , Jessica');
    await page.getByRole('link', { name: '10', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Mccree, Rendell');
  });

  test('Test Pagination: Going to Next/Previous and Next 10/Previous 10 page', async ({ page }) => {
    await page.getByRole('link', { name: 'Next', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Barber , Jessica');
    await page.getByRole('link', { name: 'Previous', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Parker, Melanie');
    await page.getByRole('link', { name: 'Next 10', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Neifert, Shawn');
    await page.getByRole('link', { name: 'Previous 10', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Parker, Melanie');
  });

  test('Test Sorting for name, Contract#, Service, Contract, Start, Status, and Job Value', async ({ page }) => {
    //Name Sort
    await page.getByRole('link', { name: 'Name', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('A Lewis, John');
    //Contract # Sort
    await page.getByRole('link', { name: 'Contract #', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('101443');
    //Service Sort
    await page.getByRole('link', { name: 'Service', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Carpentry');
    //Contract # Sort
    await page.getByRole('link', { name: 'Contract', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Feb 28, 2021');
    //Start Sort
    await page.getByRole('link', { name: 'Start', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('-');
    //Status Sort
    await page.getByRole('link', { name: 'Status', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Canceled');
    //Job Value Sort
    await page.getByRole('link', { name: 'Job Value', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('$0.01');
  });

  test('Filters: Status', async ({ page }) => {
    //open Jobs
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('radio', { name: 'Open' }).check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    
    let mainText = await page.getByRole('main').textContent();
    if (!mainText?.includes('No Jobs to list!')){
      console.log('has result');
      await expect(page.locator('tbody')).toContainText('Ordered');
      await expect(page.locator('tbody')).not.toContainText('Finished');
      await expect(page.locator('tbody')).not.toContainText('Canceled');
      await expect(page.locator('tbody')).not.toContainText('Cancellation Pending');
    }else{
      console.log('no result');
    }
    //Finished Jobs
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('radio', { name: 'Finished' }).check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    mainText = await page.getByRole('main').textContent();
    if (!mainText?.includes('No Jobs to list!')){
      await expect(page.locator('tbody')).not.toContainText('Pending');
      await expect(page.locator('tbody')).not.toContainText('Scheduled');
      await expect(page.locator('tbody')).not.toContainText('Ready');
      await expect(page.locator('tbody')).not.toContainText('Ordered');
      await expect(page.locator('tbody')).toContainText('Finished');
      await expect(page.locator('tbody')).not.toContainText('Cancellation Pending');
    }
    await expect(page.locator('tbody')).not.toContainText('Canceled');
    //Canceled Jobs
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('radio', { name: 'Canceled' }).check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    mainText = await page.getByRole('main').textContent();
    if (!mainText?.includes('No Jobs to list!')){
      await expect(page.locator('tbody')).not.toContainText('Pending');
      await expect(page.locator('tbody')).not.toContainText('Scheduled');
      await expect(page.locator('tbody')).not.toContainText('Ready');
      await expect(page.locator('tbody')).not.toContainText('Ordered');
      await expect(page.locator('tbody')).not.toContainText('Finished');
      await expect(page.locator('tbody')).toContainText('Canceled');
      await expect(page.locator('tbody')).not.toContainText('Cancellation Pending');
    }
    //Cancellation Pending Jobs
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('radio', { name: 'Cancellation Pending' }).check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    mainText = await page.getByRole('main').textContent();
    if (!mainText?.includes('No Jobs to list!')){
      await expect(page.locator('tbody')).not.toContainText('Pending');
      await expect(page.locator('tbody')).not.toContainText('Scheduled');
      await expect(page.locator('tbody')).not.toContainText('Ready');
      await expect(page.locator('tbody')).not.toContainText('Ordered');
      await expect(page.locator('tbody')).not.toContainText('Finished');
      await expect(page.locator('tbody')).not.toContainText('Canceled');
      await expect(page.locator('tbody')).toContainText('Cancellation Pending');
    }
  });

  test('Filters: Sold Date', async ({ page }) => {
    //Sold Date: After
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByLabel('Sold Date:').selectOption('a');
    await page.locator('#id_after_date').fill('2024-11-01');
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Dick, Tim');
    
    //Sold Date: Before
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByLabel('Sold Date:').selectOption('b');
    await page.locator('#id_before_date').fill('2024-11-01');
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Parker, Melanie');

    //Sold Date: Between
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByLabel('Sold Date:').selectOption('x');
    await page.locator('#id_before_date').fill('2024-12-01');
    await page.locator('#id_after_date').fill('2024-12-31');
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Cook, Nicholas');
  });

  test('Filters: Service', async ({ page }) => {
    //Service: Carpentry
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByLabel('Carpentry').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Skelton, Kendra');
    
    //Service: Doors
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Doors').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Kennedy, Kenneth');

    //Service: Exterior Painting
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Exterior Painting').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('White, Krista');

    //Service: Gutters
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Gutters').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('White, Krista');

    //Service: Insulation
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Insulation').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Ricks, Anissa');

    /*Service: Interior Painting
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Interior Painting').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Ricks, Anissa');*/

    //Service: Other
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Other').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Custead, Elaine');

    //Service: Roofing
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Roofing').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Parker, Melanie');

    //Service: Siding
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Siding').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Scutt, Bob');

    //Service: Windows
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByRole('checkbox', { name: 'Any' }).check();
    await page.getByLabel('Windows').check();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('table tbody tr').first()).toContainText('Glover, Adefolake');
  });

  test('should navigate to user job list page upon clicking the Return to Users List link', async ({ page }) => {
    // For example, we pick the Scheduler, Account
    await page.getByRole('link', { name: 'Return to Users List' }).click();

    // Validate we navigated to the correct page (for example, using the URL or a heading)
    await expect(page).toHaveURL(/\/jobs\/filter\/\d+$/);
    await expect(page).toHaveTitle(/Users/i);
  });
});