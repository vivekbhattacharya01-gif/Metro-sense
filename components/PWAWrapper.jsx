'use client';

import { usePWA } from '@/hooks/usePWA';

export function PWAWrapper({ children }) {
  usePWA();
  return children;
}