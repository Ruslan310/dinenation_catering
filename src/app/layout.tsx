import type { Metadata } from 'next';
import './globals.scss';
import { AppProvider } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import SafeHtml from '@/components/SafeHtml';
import SafeBody from '@/components/SafeBody';

export const metadata: Metadata = {
  title: 'DineNation - Food Delivery Service',
  description: 'Discover amazing food delights with our carefully curated menu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeHtml>
      <SafeBody>
        <AppProvider>
          <div style={{ minHeight: '100vh' }}>
            <Navigation />
            <main>
              {children}
            </main>
          </div>
        </AppProvider>
      </SafeBody>
    </SafeHtml>
  );
}
