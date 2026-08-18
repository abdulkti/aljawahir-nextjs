import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Amiri, Lora, Nunito_Sans } from 'next/font/google'
import './globals.css'

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aljawahirattarbawi.com'),
  title: {
    default: 'Yayasan Al Jawahir At Tarbawi — Pendidikan Islam Deli Serdang',
    template: '%s — Al Jawahir At Tarbawi',
  },
  description:
    'Yayasan Al Jawahir At Tarbawi (Al Jawahir Islamic School), lembaga pendidikan Islam terpadu di Deli Serdang, Sumatera Utara. RA, SD IT, SMP IT, dan TPA dengan kurikulum Qurani berintegritas.',
  keywords: [
    'Al Jawahir At Tarbawi',
    'Al Jawahir Islamic School',
    'sekolah islam Deli Serdang',
    'SD Islam Terpadu Sunggal',
    'SMP Islam Terpadu Sunggal',
    'tahfizh Deli Serdang',
    'yayasan pendidikan islam Sumatera Utara',
  ],
  applicationName: 'Al Jawahir At Tarbawi',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon-v4.png',
    apple: '/apple-icon-180.png',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://aljawahirattarbawi.com',
    siteName: 'Yayasan Al Jawahir At Tarbawi',
    title: 'Yayasan Al Jawahir At Tarbawi — Pendidikan Islam Deli Serdang',
    description:
      'Membangun Ilmu, Akhlak, dan Ummah melalui Pendidikan Islam yang berintegritas dan berdampak. RA, SD IT, SMP IT, dan TPA Al Jawahir di Deli Serdang.',
    images: [
      {
        url: '/logo-aljawahir.png',
        width: 512,
        height: 512,
        alt: 'Logo Yayasan Al Jawahir At Tarbawi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yayasan Al Jawahir At Tarbawi — Pendidikan Islam Deli Serdang',
    description:
      'Membangun Ilmu, Akhlak, dan Ummah melalui Pendidikan Islam yang berintegritas dan berdampak.',
    images: ['/logo-aljawahir.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${amiri.variable} ${lora.variable} ${nunitoSans.variable}`}>
      <head>
        <meta name="google-site-verification" content="7f54eaJNNu_skznyEEqO7YHwmpzwwQUO0YqF6wPZGJ4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Yayasan Al Jawahir At Tarbawi',
              alternateName: 'Al Jawahir Islamic School',
              url: 'https://aljawahirattarbawi.com',
              logo: 'https://aljawahirattarbawi.com/logo-aljawahir.png',
              image: 'https://aljawahirattarbawi.com/logo-aljawahir.png',
              foundingDate: '2006-10-17',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jl. Aman, Sunggal',
                addressLocality: 'Kecamatan Sunggal',
                addressRegion: 'Sumatera Utara',
                addressCountry: 'ID',
              },
              sameAs: ['https://instagram.com/aljawahir_islamic_school'],
              email: 'aljawahirislamicschools@gmail.com',
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white"><div>{children}</div><Analytics /><SpeedInsights /></body>
    </html>
  )
}
