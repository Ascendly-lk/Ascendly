/**
 * E2E tests for the AI Assistant / chat page.
 * Uses storageState (authenticated). AI responses mocked via page.route().
 */
import { test, expect } from '../helpers/fixtures';

const MOCK_SSE = [
  JSON.stringify({ type: 'token', content: 'Here ' }),
  JSON.stringify({ type: 'token', content: 'is ' }),
  JSON.stringify({ type: 'token', content: 'your summary.' }),
  JSON.stringify({ type: 'done', conversation_id: 'conv-e2e-1' }),
];

test.describe('AI Assistant', () => {
  test.beforeEach(async ({ page, mockApi }) => {
    // Mock chat SSE stream — avoids real LLM call
    await page.route('**/api/chat', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        headers: { 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no' },
        body: MOCK_SSE.map((e) => `data: ${e}\n\n`).join(''),
      })
    );

    // Mock conversations list
    await mockApi.json(`${mockApi.apiBase}/api/conversations`, [
      { id: 'conv-e2e-1', title: 'Q1 Review', created_at: '2026-03-01T10:00:00Z' },
    ]);

    await page.goto('/ai-assistant');
  });

  test('renders a message input and send button', async ({ page }) => {
    const input = page.getByPlaceholder(/message|ask|type/i).or(
      page.locator('textarea').first()
    );
    await expect(input).toBeVisible({ timeout: 5000 });

    const sendBtn = page.getByRole('button', { name: /send|submit/i }).first();
    await expect(sendBtn).toBeVisible();
  });

  test('sends a message and displays streamed response', async ({ page }) => {
    const input = page.getByPlaceholder(/message|ask|type/i).or(
      page.locator('textarea').first()
    );
    await input.fill('What is my revenue trend?');

    const sendBtn = page.getByRole('button', { name: /send|submit/i }).first();
    await sendBtn.click();

    // Mocked response contains "Here is your summary."
    await expect(page.getByText(/here is your summary/i)).toBeVisible({ timeout: 15_000 });
  });

  test('does not allow sending an empty message', async ({ page }) => {
    const sendBtn = page.getByRole('button', { name: /send|submit/i }).first();
    await sendBtn.click();

    // Chat endpoint should NOT be called — no response text appears
    await expect(page.getByText(/here is your summary/i)).not.toBeVisible({ timeout: 2000 });
  });

  test('shows conversation history sidebar', async ({ page }) => {
    // Previous conversation should appear
    await expect(page.getByText(/Q1 Review/i)).toBeVisible({ timeout: 5000 });
  });
});
