/**
 * Vitest global setup — runs before every test file.
 * - Extends expect with jest-dom matchers
 * - Starts the MSW mock server so no real HTTP calls are made
 */
import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
