import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default async function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // server-side instant auth guard: abort rendering and redirect before any child html streams
  if (!token) {
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
