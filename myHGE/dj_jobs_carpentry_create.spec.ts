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

test.describe('Select Job Page', () => {

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

  /*jobs/filter
  Test Active, inactive and all divisions filter
  */

  test('Jobs can only be created with unassigned quote', async ({ page }) => {
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('heading', { name: 'Jobs 1 add_box' }).getByRole('link').click();
  });

  test('Create Carpentry Quote and then Job for Pam and Paul Schultz prospect (ID = 1)', async ({ page }) => {
    await page.getByRole('heading', { name: 'Quotes' }).getByRole('link').click();
    await page.getByLabel('Quote Name:').click();
    await page.getByLabel('Quote Name:').fill('Carpentry');
    await page.getByLabel('Quote Name:').press('Tab');
    await page.getByLabel('Appointment:').selectOption('1');
    await page.getByLabel('Service:').selectOption('6');
    await page.getByPlaceholder('0.00').click();
    await page.getByPlaceholder('0.00').fill('1000');
    await page.locator('#id_contract_1').click();
    await page.locator('#id_contract_1').setInputFiles('myHGE/files/contract.png');
    await page.locator('#id_estimate_tool_1').click();
    await page.locator('#id_estimate_tool_1').setInputFiles('myHGE/files/estimate_tool.png');
    await page.getByLabel('Status:').selectOption('2');
    await page.getByRole('button', { name: 'Save' }).click();
  });
});