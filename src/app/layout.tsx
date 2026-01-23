import React from "react"
import type { Metadata } from 'next'
import { Libre_Caslon_Text, Inter } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import '~/styles/globals.css'

const _libreCaslon = Libre_Caslon_Text({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-serif'
});
const _inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Congenial AI Lab',
  description: 'Advancing artificial intelligence through research and innovation',
  generator: 'v0.app',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
