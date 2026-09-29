import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoBin — Smart Waste Management & Recycling Platform',
  description: 'Production-grade full-stack smart waste reporting, field collector route management, and municipal analytics platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-brand-dark text-slate-100 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
