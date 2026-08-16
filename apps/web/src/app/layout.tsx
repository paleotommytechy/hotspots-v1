import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@hotspots/ui-web';
import { AuthProvider } from '../context/auth-context';
import { ProtectedRoute } from '../components/protected-route';
import { AppShell } from '../components/app-shell';

export const metadata: Metadata = {
  title: 'Hotspots | Find Your People',
  description: 'Mobile-first PWA and desktop interest-based matchmaking platform.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hotspots',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFF3C4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <ProtectedRoute>
              <AppShell>{children}</AppShell>
            </ProtectedRoute>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
