import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VeritasAI | Deep Media Analyzer & Forensic Intelligence',
  description: 'Gemini-powered deepfake verification, multi-modal forensics, client-side ELA, audio spectrogram inspection, and C2PA provenance audit platform.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen selection:bg-zinc-800 selection:text-zinc-100">
        {children}
      </body>
    </html>
  )
}
