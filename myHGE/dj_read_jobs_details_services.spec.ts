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

test.describe('Check Job Details Page for Different Services', () => {

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

  test('Job View - 109627 (Carpentry)', async ({ page }) => {
    await page.goto('./jobs/2003262');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Carpentry' })).toBeVisible();
  });

  test('Job View - 153394 (Doors)', async ({ page }) => {
    await page.goto('./jobs/2018196');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Doors' })).toBeVisible();
  });

  test('Job View - 173950 (Insulation)', async ({ page }) => {
    await page.goto('./jobs/2025160');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Insulation' })).toBeVisible();
  });

  test('Job View - 102934 (Gutter)', async ({ page }) => {
    await page.goto('./jobs/2001015');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Gutters' })).toBeVisible();
  });

  test('Job View - 153733 (Gutter Protection)', async ({ page }) => {
    await page.goto('./jobs/2018309');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Gutter Protection' })).toBeVisible();
  });
  
  test('Job View - 153274 (others)', async ({ page }) => {
    await page.goto('./jobs/2018155');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
  });

  test('Job View - 108061 (Roofing)', async ({ page }) => {
    await page.goto('./jobs/2002738');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Roofing' })).toBeVisible();
  });

  test('Job View - 108781 (Siding)', async ({ page }) => {
    await page.goto('./jobs/2002978');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Siding' })).toBeVisible();
  });
  
  test('Job View - 100207 (Windows)', async ({ page }) => {
    await page.goto('./jobs/2000170');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Windows' })).toBeVisible();
  });

  test('Job View - 100711 (Exterior Painting)', async ({ page }) => {
    await page.goto('./jobs/2000002');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job');
    await expect(page.getByRole('link', { name: 'Exterior Painting' })).toBeVisible();
  });

  test('Job View - 100717 (Interior Painting)', async ({ page }) => {
    await page.goto('./jobs/2000000');
    await expect(page.locator('#templateBreadcrumbs')).toContainText('View Job')
    await expect(page.getByRole('link', { name: 'Interior Painting' })).toBeVisible();
  });
});