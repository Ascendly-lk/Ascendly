/**
 * Shared Playwright fixtures.
 * Extends the base `test` with a `mockApi` helper that intercepts backend calls.
 */
import { test as base, Page } from '@playwright/test';

const API = process.env.BACKEND_URL ?? 'http://localhost:8000';

/** Route a backend endpoint to a static JSON response. */
async function mockJson(page: Page, url: string, body: unknown, status = 200) {
  await page.route(url, (route) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  );
}

/** Route a backend endpoint to an SSE stream (for chat). */
async function mockSse(page: Page, url: string, events: string[]) {
  await page.route(url, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: events.map((e) => `data: ${e}\n\n`).join(''),
    })
  );
}

// Always mock /auth/me so tests work without real Supabase credentials in CI
const MOCK_ME = { id: 'e2e-user-id', email: 'testuser@ascendly.test', role: 'startup' };

export const test = base.extend<{
  mockApi: {
    json: typeof mockJson;
    sse: typeof mockSse;
    apiBase: string;
  };
}>({
  mockApi: async ({ page }, use) => {
    await mockJson(page, `${API}/auth/me`, MOCK_ME);
    await use({ json: mockJson.bind(null, page), sse: mockSse.bind(null, page), apiBase: API });
  },
});

export { expect } from '@playwright/test';
