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

  // server auth guard
  // if (!token) {
  //   redirect('/login');
  // }

  return <DashboardLayout>{children}</DashboardLayout>;
}
