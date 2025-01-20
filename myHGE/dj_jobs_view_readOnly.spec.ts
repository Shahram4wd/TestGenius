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

test.describe('Select Job Page', () => {

  // Runs before each test
  test.beforeEach(async ({ page }) => {
    // Get session ID from auth.json
    const sessionId = getSessionIdFromAuth();

    // Construct the target URL
    const targetUrl = `./jobs/2028785`;

    // Navigate to the constructed URL
    await page.goto(targetUrl);
    await page.reload();
  });

  /*jobs/filter
  Test Active, inactive and all divisions filter
  */

  test('Job View - 184216 (Carpentry): Panels', async ({ page }) => {
    //Title
    await expect(page.locator('h2')).toContainText('Bradley FluckCarpentry');
    //Status
    await expect(page.locator('#templateMain')).toContainText('Finished');
    //Contract Panel
    await expect(page.getByRole('heading', { name: 'Contract visibility' })).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('184216');
    await expect(page.locator('#templateMain')).toContainText('Nov 12, 2024');
    await expect(page.locator('#templateMain')).toContainText('0');
    await expect(page.locator('#templateMain')).toContainText('Russo, Vincenzo');
    //Prospect Panel
    await expect(page.locator('#templateMain')).toContainText('Bradley Fluck');
    await expect(page.locator('address')).toContainText('132 Lexington AvenuePitman NJ 08071');
    await expect(page.locator('#templateMain')).toContainText('Year Built 1910');
    await expect(page.locator('#templateMain')).toContainText('bbkbf@comcast.net');
    await expect(page.locator('#templateMain')).toContainText('856-534-1338 (Work)');
    //Quote Panel
    await expect(page.getByRole('heading', { name: 'Quotes' })).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('Trim $7,775.00 Carpentry All white trim on eves and rakes and 9 window caps only no soffits');
    //Production
    await expect(page.locator('#templateMain').getByRole('heading', { name: 'Production' })).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('Taimoorshah Ayazi');
    await expect(page.locator('#templateMain')).toContainText('Nov, 2024');
    await expect(page.locator('#templateMain')).toContainText('GL Gutter Expert Co');
    await expect(page.locator('#templateMain')).toContainText('$1,545.00');
    await expect(page.locator('#templateMain')).toContainText('11/30/2024');
    await expect(page.locator('#templateMain')).toContainText('November 2024');
    //Amounts Panel
    await expect(page.getByRole('heading', { name: 'Amounts' })).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('$7,775.00');
    await expect(page.locator('#templateMain')).toContainText('$0.00');
    //Amounts Panel
    await expect(page.locator('#link-sales-tax-exempt')).toContainText('money_off');
    await expect(page.getByRole('heading', { name: 'Payments visibility' })).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('$0.00');
    //Payments Panel
    await expect(page.getByRole('heading', { name: 'Job Costing visibility' })).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('$2,893.43');
    await expect(page.locator('#templateMain')).toContainText('37.2%');
    await expect(page.locator('#templateMain')).toContainText('$2,573.59');
    await expect(page.locator('#templateMain')).toContainText('33.1%');
    await expect(page.locator('#templateMain')).toContainText('$7,775.00');
    await expect(page.locator('#templateMain')).toContainText('$1,545.00');
    await expect(page.locator('#templateMain')).toContainText('19.9%');
    await expect(page.locator('#templateMain')).toContainText('$1,028.59');
    await expect(page.locator('#templateMain')).toContainText('13.2%');
    await expect(page.locator('#templateMain')).toContainText('$5,201.41');
    await expect(page.locator('#templateMain')).toContainText('66.9%');
    //Commission Payouts Panel
    await expect(page.getByRole('heading', { name: 'Commission Payouts' })).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('$699.75');
    await expect(page.locator('#templateMain')).toContainText('9.0%');
    await expect(page.locator('#templateMain')).toContainText('$3,273.34');
    await expect(page.locator('#templateMain')).toContainText('42.1%');
    //Job Photos Panel
    await expect(page.getByRole('heading', { name: 'Job Photos' }).locator('small')).toBeVisible();
    await expect(page.locator('#templateMain')).toContainText('9');
  });

  test('Job View - 184216: Popups Prospect, Prospect Address, Job Costing, Job List', async ({ page }) => {
    //await page.goto("./jobs/2028785");
    //Popup Prospect
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('heading', { name: 'Prospect visibility' }).getByRole('link').click();
    const page1 = await page1Promise;
    await expect(page1.getByRole('heading', { name: 'Bradley Fluck arrow_back' })).toBeVisible();
    //Popup Prospect Address
    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: '132 Lexington Avenue Pitman' }).click();
    const page2 = await page2Promise;
    await expect(page2.getByRole('heading', { name: 'Lexington Ave' })).toBeVisible();
    //Popup Job Costing
    const page3Promise = page.waitForEvent('popup');
    await page.getByRole('heading', { name: 'Job Costing visibility' }).getByRole('link').click();
    const page3 = await page3Promise;
    await expect(page3.getByText('place Reports \\ Job Costing')).toBeVisible();
    //Return to Job List
    await page.getByRole('link', { name: 'Return to Job List' }).click();
    await expect(page.getByText('place Jobs \\ Philadelphia \\')).toBeVisible();
  });

  test('Job View - 184216: Edit Panel', async ({ page }) => {
    //Edit Contract
    await expect(page.locator('#templateMain')).toContainText('Contract');
    await page.getByRole('link', { name: 'Contract', exact: true }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Edit Contract');
    //Financing
    await expect(page.locator('#templateMain')).toContainText('Financing');
    await page.locator('#templateMain').getByRole('link', { name: 'Financing' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Edit Financing');
    //Carpentry
    await page.getByRole('link', { name: 'Carpentry' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Edit Carpentry');
    await page.getByRole('link', { name: 'Return to View Job' }).click();
  });

  test('Job View - 184216: Manage Panel', async ({ page }) => {
    //await page.goto("./jobs/2028785");
    //Production Attachments
    await expect(page.locator('#templateMain')).toContainText('Production Attachments');
    await page.getByRole('link', { name: 'Production Attachments' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Production Attachments');
    await page.getByRole('link', { name: 'Return to View Job' }).click();
    //Sales Attachments
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('Sales Attachments');
    await page.getByRole('link', { name: 'Sales Attachments' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Sales Attachments');
    await page.getByRole('link', { name: 'Return to View Job' }).click();
    //Change Orders
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('Change Orders');
    await page.getByRole('link', { name: 'Change Orders' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Change Orders');
    await page.getByRole('link', { name: 'Back to Job' }).click();
    //Photos
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('Photos');
    await page.getByRole('link', { name: 'Photos' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Job Photos');
    await page.getByRole('link', { name: 'Return to View Job' }).click();
    //Labor Adjustments
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('Labor Adjustments');
    await page.getByRole('link', { name: 'Labor Adjustments' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Labor Adjustments');
    await page.getByRole('link', { name: 'Return to Job Details Page' }).click();
    //Commissions
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('Commissions');
    await page.getByRole('link', { name: 'Commissions' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Job Commissions');
    await page.getByRole('link', { name: 'Return to Job' }).click();
    //Warranty Claims
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('Warranty Claims');
    await page.getByRole('link', { name: 'Warranty Claims' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Claims');
    await page.getByRole('link', { name: 'Back to Job' }).click();
    //Damage Claims
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('Damage Claims');
    await page.getByRole('link', { name: 'Damage Claims' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Claims');
    await page.getByRole('link', { name: 'Back to Job' }).click();
    //PM Pre-Close Out
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('PM Pre-Close Out');
    await page.getByRole('link', { name: 'PM Pre-Close Out' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('PM Pre-Close-Out');
    await page.getByRole('link', { name: 'Return to Job View' }).click();
    //PM Post Close Out
    await page.goto("./jobs/2028785");
    await expect(page.locator('#templateMain')).toContainText('PM Post Close Out');
    await page.getByRole('link', { name: 'PM Post Close Out' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('PM Post Close Out');
    await page.getByRole('link', { name: 'Return to View Job' }).click();
  });

  test('Job View - 184216: View Panel', async ({ page }) => {
    //await page.goto("./jobs/2028785");
    //View Panel
    await expect(page.locator('#templateMain')).toContainText('View');
    //JSA
    await expect(page.locator('#templateMain')).toContainText('JSA');
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'JSA open_in_new' }).click();
    const page1 = await page1Promise;
    await expect(page1.locator('h1')).toContainText('Job Site Details');
    //Invoice
    await expect(page.locator('#templateMain')).toContainText('Invoice');
    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Invoice open_in_new' }).click();
    const page2 = await page2Promise;
    await expect(page2.locator('h1')).toContainText('Invoice');
    //Balances
    await expect(page.locator('#templateMain')).toContainText('Balances');
    await page.getByRole('link', { name: 'Balances' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Balances');
    await page.getByRole('link', { name: 'Return to View Job' }).click();
    //Notes
    await expect(page.locator('#templateMain')).toContainText('Notes');
    await page.getByRole('link', { name: 'Notes' }).click();
    await expect(page.locator('h2')).toContainText('Notes');
    await page.getByRole('link', { name: 'Return to View Job' }).click();
    //History
    await expect(page.locator('#templateMain')).toContainText('History');
    await page.getByRole('link', { name: 'History', exact: true }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('History');
    await page.getByRole('link', { name: 'Return to Job' }).click();


  });

  test('Job View - 184216: Return to Jobs List', async ({ page }) => {
    //await page.goto("./jobs/2028785");
    //View Panel
    await page.getByRole('link', { name: 'Return to Job List' }).click();
    await expect(page.locator('h2')).toContainText('Return to Users List');
  });
});