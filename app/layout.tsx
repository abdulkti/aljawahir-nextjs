import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yayasan Al Jawahir At Tarbawi — Pendidikan Islam Deli Serdang',
  description: 'Yayasan Al Jawahir At Tarbawi — Al Jawahir Islamic School di Deli Serdang, Sumatera Utara.',
  openGraph: {
    title: 'Yayasan Al Jawahir At Tarbawi',
    description: 'Membangun Ilmu, Akhlak, dan Ummah melalui Pendidikan Islam.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
