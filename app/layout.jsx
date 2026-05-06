import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import { PWAWrapper } from '@/components/PWAWrapper'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: 'MetroSense - Delhi Metro AI Assistant',
  description: 'Smart Delhi Metro trip planner with AI-powered route suggestions, real-time tracking, and fare calculator',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MetroSense',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'MetroSense',
    title: 'MetroSense - Delhi Metro AI Assistant',
    description: 'Smart Delhi Metro trip planner with AI-powered route suggestions, real-time tracking, and fare calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetroSense - Delhi Metro AI Assistant',
    description: 'Smart Delhi Metro trip planner with AI-powered route suggestions, real-time tracking, and fare calculator',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <PWAWrapper>
              {children}
            </PWAWrapper>
          </LanguageProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
