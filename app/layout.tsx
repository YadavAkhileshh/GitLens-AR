import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GitLens AR - Visualize GitHub Repositories in 3D',
  description: 'Experience your GitHub repositories in stunning 3D visualizations. Explore branches, commits, contributors, and pull requests in an interactive augmented reality environment.',
  keywords: ['GitHub', 'Git', 'Visualization', '3D', 'AR', 'Augmented Reality', 'Repository', 'Code', 'Developer Tools'],
  authors: [{ name: 'Akhilesh Yadav', url: 'https://github.com/YadavAkhileshh' }],
  creator: 'Akhilesh Yadav',
  openGraph: {
    title: 'GitLens AR - Visualize GitHub Repositories in 3D',
    description: 'Experience your GitHub repositories in stunning 3D visualizations',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitLens AR - Visualize GitHub Repositories in 3D',
    description: 'Experience your GitHub repositories in stunning 3D visualizations',
    creator: '@_Yakhil',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/gtar.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
