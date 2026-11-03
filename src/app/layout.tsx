import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Yuksalish Hub — O‘zbekiston yoshlarining yagona rivojlanish ekotizimi',
  description:
    'Bilim sari birlashamiz. Kelajak sari yuksalamiz. Kitobxonlik, xorijiy tillar, IT, liderlik va volontyorlik bo‘yicha 14 ta hudud yoshlari yagona maydonda.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
        <Suspense fallback={<div className="h-16 bg-slate-950 border-b border-slate-800" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
