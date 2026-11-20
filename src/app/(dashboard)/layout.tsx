import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default async function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // server-side auth guard: prevents unauthorized dashboard rendering
  if (!token) {
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
