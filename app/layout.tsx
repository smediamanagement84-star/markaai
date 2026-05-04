import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MarkaAI — Nepal\'s AI Social Media Partner',
    template: '%s | MarkaAI',
  },
  description: 'AI-powered social media marketing platform built for Nepali businesses. Generate campaigns, schedule posts, and grow your audience.',
  keywords: ['social media', 'AI marketing', 'Nepal', 'Instagram', 'Facebook', 'campaign'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MarkaAI',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
