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

  test('Job View - 177271 (Carpentry)', async ({ page }) => {
    //Title
    await page.goto('./jobs/2028785');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Carpentry' })).toBeVisible();
  });

  test('Job View - 100207 (Windows)', async ({ page }) => {
    //Title
    await page.goto('./jobs/2000170');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Windows' })).toBeVisible();
  });

  test('Job View - 153394 (Doors)', async ({ page }) => {
    //Title
    await page.goto('./jobs/2018196');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.locator('#templateMain')).toContainText('Doors');
  });

  
});