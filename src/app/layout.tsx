import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://doctor-tracker-biswanath.vercel.app'),
  title: {
    default: 'Doctor Tracking | Doctor and Patient Directory',
    template: '%s | Doctor Tracking',
  },
  description:
    'Comprehensive healthcare administration platform for managing specialist doctors, in-patient admissions, clinical release tracking, and real-time medical telemetry.',
  applicationName: 'Doctor Tracking',
  authors: [{ name: 'Biswanath Sarker' }],
  creator: 'Biswanath Sarker',
  publisher: 'Care Guide BD',
  keywords: [
    'Doctor Tracking',
    'Patient Directory',
    'Healthcare Administration',
    'Hospital Telemetry',
    'Doctor Patient Management',
    'Care Guide BD',
    'Medical Records System',
    'Clinical Workload Analytics',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://doctor-tracker-biswanath.vercel.app',
    siteName: 'Doctor Tracking',
    title: 'Doctor Tracking | Doctor and Patient Directory',
    description:
      'Enterprise healthcare administration portal for managing specialist doctors, tracking patient admissions, and visualizing real-time clinical workload.',
    images: [
      {
        url: '/screenshots/01-dashboard-desktop.png',
        width: 1280,
        height: 720,
        alt: 'Doctor Tracking Analytics Dashboard Overview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doctor Tracking | Doctor and Patient Directory',
    description:
      'Enterprise healthcare administration portal for managing specialist doctors, tracking patient admissions, and visualizing real-time clinical workload.',
    images: ['/screenshots/01-dashboard-desktop.png'],
    creator: '@BiswanathBD',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
