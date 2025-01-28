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
    (cookie: { name: string }) => 
      cookie.name === 'hge_stage_session_id' || cookie.name === 'hge_dev_session_id'
  );

  if (!sessionCookie || !sessionCookie.value) {
    throw new Error('Session ID not found in auth.json');
  }

  // Remove quotes from the session ID if necessary
  return sessionCookie.value.replace(/"/g, '');
}

test.describe('Create Carpentry Job', () => {

  // Runs before each test
  test.beforeEach(async ({ page }) => {
    // Get session ID from auth.json
    const sessionId = getSessionIdFromAuth();

    // Construct the target URL
    const targetUrl = `./prospects/1`;

    // Navigate to the constructed URL
    await page.goto(targetUrl);
    await page.reload();
  });

  test('Jobs can only be created with unassigned quote', async ({ page }) => {
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('heading', { name: 'Jobs 1 add_box' }).getByRole('link').click();
  });

  test.afterAll('Create Carpentry Quote for Pam and Paul Schultz prospect (ID = 1)', async ({ page }) => {
    await page.getByRole('heading', { name: 'Quotes' }).getByRole('link').click();
    await page.getByLabel('Quote Name:').click();
    await page.getByLabel('Quote Name:').fill('Carpentry');
    await page.getByLabel('Quote Name:').press('Tab');
    await page.getByLabel('Appointment:').selectOption('1');
    await page.getByLabel('Service:').selectOption('6');
    await page.getByPlaceholder('0.00').click();
    await page.getByPlaceholder('0.00').fill('1000');
    if (await page.getByRole('link', { name: 'Upload a new file' }) == null){
      await page.locator('#id_contract_1').click();
      await page.locator('#id_contract_1').setInputFiles('myHGE/files/contract.png');
    } else {
      await page.locator('input[type="radio"][name="contract_0"]').click();
    }
    await page.locator('#id_estimate_tool_1').click();
    await page.locator('#id_estimate_tool_1').setInputFiles('myHGE/files/estimate_tool.png');
    await page.getByLabel('Status:').selectOption('2');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForNavigation();
    const currentUrl = page.url();
    expect(currentUrl).not.toContain("secure");
  });

  test('Create Carpentry Job in Zope for Pam and Paul Schultz prospect (ID = 1)', async ({ page }) => {
    await page.getByRole('link', { name: 'Add Job' }).click();
    await page.getByLabel('Carpentry $1,000.00 Carpentry').check();
    await page.locator('#contract-file').click();
    await page.locator('#contract-file').setInputFiles('contract.png');
    await page.locator('#price-level').selectOption('1_year');
    await page.locator('#field-user-id div').click();
    await page.locator('select[name="sold_user_id"]').selectOption('750843761');
    await page.getByLabel('Yes').check();
    await page.locator('#field-is-lead-pb').getByText('No', { exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.locator('#additional-details').click();
    await page.locator('#additional-details').fill('Carpentry Additional Details');
    await page.getByRole('button', { name: 'Add' }).click();
  });
});