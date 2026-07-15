import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '@/components/layout/sidebar';
import { ThemeProvider } from '@/components/theme-provider';

// Mock Next.js routing hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Layout Components', () => {
  it('renders Sidebar with branding and links', () => {
    render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );
    expect(screen.getByText('BetterAuth')).toBeInTheDocument();
    expect(screen.getByText('Studio')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });
});
