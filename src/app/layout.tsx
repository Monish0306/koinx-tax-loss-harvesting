import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TaxProvider } from '@/context/TaxContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Tax Loss Harvesting | KoinX',
  description: 'Optimise your crypto tax liability with intelligent tax loss harvesting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#0F1117] text-white antialiased">
        {/* TaxProvider wraps the whole app — proper useContext state management */}
        <TaxProvider>
          {children}
        </TaxProvider>
      </body>
    </html>
  );
}
