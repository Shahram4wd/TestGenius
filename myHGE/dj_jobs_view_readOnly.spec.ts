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
    const targetUrl = `./jobs/filter`;

    // Navigate to the constructed URL
    await page.goto(targetUrl);
    await page.reload();
  });

  /*jobs/filter
  Test Active, inactive and all divisions filter
  */

  test('Job View - 184216 (Carpentry): Panels', async ({ page }) => {
    await page.getByRole('link', { name: 'Philadelphia' }).click();
    await page.locator('#is-inactive').selectOption('');
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.getByText('Filter User Status All Active Inactive Filter').click();
    await page.getByRole('link', { name: 'Russo, Vincenzo' }).click();
    await page.getByRole('button', { name: 'filter_alt' }).click();
    await page.getByText('Finished').click();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    //Title
    await page.getByRole('row', { name: 'Fluck, Bradley 184216 132' }).getByRole('link').click();
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
    await page.goto("./jobs/2028785");
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
    await page.goto("./jobs/2028785");
    //Edit Contract
    await expect(page.locator('#templateMain')).toContainText('Contract');
    await page.getByRole('link', { name: 'Contract', exact: true }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Edit Contract');
    //Financing
    await expect(page.locator('#templateMain')).toContainText('Financing');
    await page.locator('#templateMain').getByRole('link', { name: 'Financing' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Edit Financing');
  });

  test('Job View - 184216: Manage Panel', async ({ page }) => {
    await page.goto("./jobs/2028785");
    //Production Attachment
    await expect(page.locator('#templateMain')).toContainText('Production Attachments');
    await expect(page.locator('#templateMain')).toContainText('4');
    await page.getByRole('link', { name: 'Production Attachments' }).click();
    await expect(page.locator('#templateBreadcrumbs')).toContainText('Production Attachments');
  });
});