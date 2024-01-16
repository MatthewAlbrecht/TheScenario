'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import queryClient from './queryClient';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
