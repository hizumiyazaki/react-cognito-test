'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/layouts/header/Header';
import { useRouter } from 'next/navigation';
import { isTokenExpiringSoon } from '@/lib/cognitoClient';
import { useEffect } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  useEffect(() => {
    try {
      if (isTokenExpiringSoon()) router.push('/login');
    } catch (error) {
      console.error(error);
      router.push('/login');
    }
  }, [router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
