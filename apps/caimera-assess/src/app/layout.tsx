import './global.css';
import { Figtree } from 'next/font/google';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Caimera Assess',
  description: 'Assessment platform powered by Caimera',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
