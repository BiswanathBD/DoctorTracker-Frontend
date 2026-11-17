import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
