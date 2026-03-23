/**
 * E2E tests for the File Upload page (/upload or /ai-analytics/upload).
 * Uses storageState (authenticated). Mocks the backend upload endpoint.
 */
import { test, expect } from '../helpers/fixtures';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

test.describe('File Upload', () => {
  test('upload page renders file input or drop zone', async ({ page }) => {
    await page.goto('/');
    // Navigate to upload — try common routes
    const uploadLink = page.getByRole('link', { name: /upload|data/i }).first();
    if (await uploadLink.isVisible()) {
      await uploadLink.click();
    } else {
      await page.goto('/ai-analytics/upload');
    }

    // File input exists (may be hidden — use locator not visible check)
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1, { timeout: 5000 });
  });

  test('can upload a CSV file and see success feedback', async ({ page, mockApi }) => {
    // Mock upload endpoint
    await mockApi.json(`${mockApi.apiBase}/api/upload`, {
      file_id: 'test-file-id-001',
      filename: 'sales_data.csv',
      size_bytes: 512,
      uploaded_at: new Date().toISOString(),
      status: 'processed',
    });

    await page.goto('/ai-analytics/upload');

    // Create a temp CSV file
    const tmpFile = path.join(os.tmpdir(), 'sales_data.csv');
    fs.writeFileSync(tmpFile, 'date,revenue,expenses\n2024-01,10000,6000\n2024-02,12000,7000\n');

    // Set the file on the hidden input directly
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(tmpFile);

    fs.unlinkSync(tmpFile);

    // Wait for any success indicator
    await expect(
      page.getByText(/success|uploaded|processed|complete/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('shows error on unsupported file type', async ({ page }) => {
    await mockApi.json(`${mockApi.apiBase}/api/upload`, { detail: 'Unsupported file type' }, 400);

    await page.goto('/ai-analytics/upload');

    const tmpFile = path.join(os.tmpdir(), 'malware.exe');
    fs.writeFileSync(tmpFile, 'MZ');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(tmpFile);
    fs.unlinkSync(tmpFile);

    await expect(
      page.getByText(/unsupported|invalid|error/i).first()
    ).toBeVisible({ timeout: 5000 });
  });
});
