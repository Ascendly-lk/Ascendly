/**
 * E2E tests for the File Upload page (/dashboard/ai-analytics/upload).
 * Uses storageState (authenticated). Mocks the backend upload endpoint.
 */
import { test, expect } from '../helpers/fixtures';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const API = process.env.BACKEND_URL ?? 'http://localhost:8000';
const MOCK_ME = { id: 'e2e-user-id', email: 'testuser@ascendly.test', role: 'startup' };

test.describe('File Upload', () => {
  test('upload page renders file input or drop zone', async ({ page }) => {
    // Mock /auth/me so the protected route doesn't redirect to login
    await page.route(`${API}/auth/me`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ME) })
    );

    await page.goto('/dashboard/ai-analytics/upload');

    // File input exists (may be hidden — use locator not visible check)
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1, { timeout: 8000 });
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

    await page.goto('/dashboard/ai-analytics/upload');

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

  test('shows error on unsupported file type', async ({ page, mockApi }) => {
    await mockApi.json(`${mockApi.apiBase}/api/upload`, { detail: 'Unsupported file type' }, 400);

    await page.goto('/dashboard/ai-analytics/upload');

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
