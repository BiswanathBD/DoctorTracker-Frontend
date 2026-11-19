import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default async function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <DashboardLayout>{children}</DashboardLayout>;
}
