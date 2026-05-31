import type { Metadata, Viewport } from 'next';
import { Inter, Geist } from 'next/font/google';

import { APP } from '@/lib/constants';
import { Providers } from './providers';

import './globals.css';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: APP.name,
    template: `%s | ${APP.name}`,
  },
  description: APP.description,
  keywords: ['thú cưng', 'chó mèo', 'khám thú y', 'đặt lịch chăm sóc', 'pet shop', 'veterinary'],
  authors: [{ name: APP.name }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: APP.name,
    description: APP.description,
    siteName: APP.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP.name,
    description: APP.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
