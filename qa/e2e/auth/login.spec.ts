/**
 * E2E tests for the Login page (/login).
 * These tests do NOT use storageState — they test the unauthenticated flow.
 */
import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } }); // Force unauthenticated

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders login form', async ({ page }) => {
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|log in|login/i })).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    // Some error text should appear
    const errors = page.locator('[class*="error"], [class*="invalid"], [role="alert"]');
    await expect(errors.first()).toBeVisible({ timeout: 3000 });
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.route('**/auth/signin', (route) =>
      route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ detail: 'Invalid credentials' }) })
    );

    await page.getByPlaceholder(/email/i).fill('wrong@ascendly.test');
    await page.getByPlaceholder(/password/i).fill('WrongPass123');
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();

    await expect(page.getByText(/invalid|incorrect|wrong|credentials/i)).toBeVisible({ timeout: 5000 });
  });

  test('has link to register page', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /register|sign up|create account/i });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/register|signup/i);
  });

  test('redirects to dashboard after successful login', async ({ page }) => {
    // Mock the signin endpoint to return a valid session
    await page.route('**/auth/signin', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-e2e-token',
          user: { id: 'u1', email: 'test@ascendly.test', role: 'startup' },
        }),
      })
    );

    await page.getByPlaceholder(/email/i).fill('test@ascendly.test');
    await page.getByPlaceholder(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();

    // Should navigate away from /login
    await expect(page).not.toHaveURL(/\/login$/, { timeout: 10_000 });
  });

  test('unauthenticated access to protected route redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });
});
