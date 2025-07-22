import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'EO - Clínica Estética',
  description: 'Experimenta el arte de la transformación.',
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("font-sans antialiased bg-background", poppins.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex flex-col h-screen">
              <main className="flex-grow pb-24">{children}</main>
              <BottomNav />
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
