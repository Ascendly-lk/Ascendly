/**
 * Auth setup — runs once before all E2E test specs.
 * Logs in with real credentials and saves storageState to .auth-state.json
 * so all other specs start already authenticated (skips login flow).
 */
import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AUTH_STATE = path.resolve(__dirname, '.auth-state.json');

setup('authenticate once', async ({ page }) => {
  const email = process.env.TEST_EMAIL ?? 'testuser@ascendly.test';
  const password = process.env.TEST_PASSWORD ?? '';

  if (!password) {
    // If no credentials are provided, create a minimal localStorage state
    // so specs can still run with mocked API routes.
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('ascendly_token', 'e2e-mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: 'e2e-user-id',
        email: 'testuser@ascendly.test',
        role: 'startup',
      }));
    });
    await page.context().storageState({ path: AUTH_STATE });
    return;
  }

  await page.goto('/login');

  // Fill login form
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();

  // Wait for redirect away from login page
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });

  // Persist session
  await page.context().storageState({ path: AUTH_STATE });
});
