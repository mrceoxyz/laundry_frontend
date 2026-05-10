import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Providers } from './providers';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'EliteLaundry Solutions',
    template: '%s | EliteLaundry Solutions',
  },
  description:
    'EliteLaundry Solutions provides reliable laundry pickup, washing, ironing, and delivery services.',
  keywords: [
    'Laundry service',
    'Laundry pickup',
    'Dry cleaning',
    'EliteLaundry',
    'Laundry Kano',
  ],
  openGraph: {
    title: 'EliteLaundry Solutions',
    description: 'Convenient, reliable and timely laundry services.',
    siteName: 'EliteLaundry',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Navigation />
            <Toaster position="top-center" reverseOrder={false} />
            <main className='inset-0 -z-10 bg-linear-to-br from-green-500/70 via-blue-500/70 to-green-500/10 dark:from-green-500/70 dark:via-blue-500/70 dark:to-green-500/70'>{children}
            <WhatsAppButton />
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}