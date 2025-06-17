import type { Metadata } from 'next';
//import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { ThemeSwitcher } from '@/ui/theme';

//const notoSans = Noto_Sans({
//  variable: '--font-noto-sans',
//  subsets: ['latin'],
//});
//
//const notoSansMono = Noto_Sans_Mono({
//  variable: '--font-noto-sans-mono',
//  subsets: ['latin'],
//});

export const metadata: Metadata = {
  title: 'Justus Polzin\'s Blog',
  description: 'Justus Polzin\'s Blog',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico"></link>
      </head>
      <body>
        <ThemeSwitcher />
        <div className="mx-auto max-w-screen-md pt-12 px-4 lg:px-0">
          {children}
        </div>
      </body>
    </html>
  );
}
