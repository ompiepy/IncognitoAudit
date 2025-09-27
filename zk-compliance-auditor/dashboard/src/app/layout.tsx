import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZK Compliance Auditor',
  description: 'Zero-Knowledge Compliance Auditing Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-700">
        {children}
      </body>
    </html>
  )
}