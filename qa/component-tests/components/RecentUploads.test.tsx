/**
 * Tests for RecentUploads component.
 * API calls mocked via MSW (handlers.ts).
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('@/components/aianalytics/RecentUploads.css', () => ({}));

// Lazily import after mocks are set up
const importComponent = () =>
  import('@/components/aianalytics/RecentUploads.jsx').then((m) => m.default);

describe('RecentUploads', () => {
  it('renders without crashing', async () => {
    const RecentUploads = await importComponent();
    const { container } = render(<RecentUploads />);
    expect(container).toBeInTheDocument();
  });

  it('shows files returned by the API', async () => {
    const RecentUploads = await importComponent();
    render(<RecentUploads />);
    // MSW returns two files: sales_q1.csv and financials.xlsx
    await waitFor(() => {
      expect(screen.queryByText(/sales_q1\.csv/i) || screen.queryByText(/financials/i)).toBeTruthy();
    }, { timeout: 3000 });
  });
});
