/**
 * Tests for AIStatCard component.
 * Pure presentational — no API calls, no router needed.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AIStatCard from '@/components/aianalytics/AIStatCard.jsx';

// Stub CSS imports so jsdom doesn't choke
vi.mock('@/components/aianalytics/AIStatCard.css', () => ({}));
vi.mock('@/components/aianalytics/SparklineChart.jsx', () => ({
  default: () => <svg data-testid="sparkline" />,
}));

describe('AIStatCard', () => {
  const baseProps = {
    icon: <span data-testid="icon">📊</span>,
    title: 'Files Uploaded',
    value: '42',
  };

  it('renders title and value', () => {
    render(<AIStatCard {...baseProps} />);
    expect(screen.getByText('Files Uploaded')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders icon slot', () => {
    render(<AIStatCard {...baseProps} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('shows positive change with correct class', () => {
    const { container } = render(<AIStatCard {...baseProps} change="+12%" />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
    const badge = container.querySelector('.ai-stat-card__change');
    expect(badge).toHaveClass('positive');
  });

  it('shows negative change with correct class', () => {
    const { container } = render(<AIStatCard {...baseProps} change="-5%" />);
    const badge = container.querySelector('.ai-stat-card__change');
    expect(badge).toHaveClass('negative');
  });

  it('does not render change badge when change prop is absent', () => {
    const { container } = render(<AIStatCard {...baseProps} />);
    expect(container.querySelector('.ai-stat-card__change')).toBeNull();
  });

  it('renders sparkline when sparkData has >= 2 points', () => {
    render(<AIStatCard {...baseProps} change="+5%" sparkData={[10, 20, 30]} />);
    expect(screen.getByTestId('sparkline')).toBeInTheDocument();
  });

  it('does not render sparkline when sparkData has < 2 points', () => {
    render(<AIStatCard {...baseProps} sparkData={[10]} />);
    expect(screen.queryByTestId('sparkline')).toBeNull();
  });

  it('applies dark variant class by default', () => {
    const { container } = render(<AIStatCard {...baseProps} />);
    expect(container.querySelector('.ai-stat-card--dark')).toBeInTheDocument();
  });

  it('applies custom variant class', () => {
    const { container } = render(<AIStatCard {...baseProps} variant="light" />);
    expect(container.querySelector('.ai-stat-card--light')).toBeInTheDocument();
  });
});
