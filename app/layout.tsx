// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeWrapper from './theme-wrapper'
import { Providers } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </Providers>
      </body>
    </html>
  );
}
