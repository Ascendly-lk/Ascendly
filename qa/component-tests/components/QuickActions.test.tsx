/**
 * Tests for QuickActions component.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/components/aianalytics/QuickActions.css', () => ({}));

const importComponent = () =>
  import('@/components/aianalytics/QuickActions.jsx').then((m) => m.default);

describe('QuickActions', () => {
  it('renders without crashing', async () => {
    const QuickActions = await importComponent();
    const { container } = render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders at least one clickable action', async () => {
    const QuickActions = await importComponent();
    render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>
    );
    // Should have buttons or links
    const buttons = screen.queryAllByRole('button');
    const links = screen.queryAllByRole('link');
    expect(buttons.length + links.length).toBeGreaterThan(0);
  });
});
