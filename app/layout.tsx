import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "NexaFlow - Enterprise Decentralized Content Management",
    template: "%s | NexaFlow",
  },
  description:
    "Enterprise-grade decentralized content management platform powered by IPFS, DID technology, and advanced Web3 infrastructure. Built by MJ AHMAD for the future of decentralized applications.",
  keywords: [
    "NexaFlow",
    "IPFS",
    "DID",
    "Web3",
    "Decentralized",
    "Content Management",
    "Blockchain",
    "Nexara",
    "Enterprise",
    "Production",
    "MJ AHMAD",
  ],
  authors: [{ name: "MJ AHMAD", url: "https://nexarabd.vercel.app/mjahmad" }],
  creator: "MJ AHMAD",
  publisher: "Nexara Technologies",
  robots: "index, follow",
  openGraph: {
    title: "NexaFlow - Enterprise Decentralized Content Management",
    description: "Enterprise-grade decentralized content management powered by IPFS and DID technology",
    url: "https://mjnexaflow.vercel.app",
    siteName: "NexaFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexaFlow Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaFlow - Enterprise Decentralized Content Management",
    description: "Enterprise-grade decentralized content management powered by IPFS and DID technology",
    creator: "@mjahmad25",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#2563eb" }],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://mjnexaflow.vercel.app",
  },
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#ffffff",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="canonical" href="https://mjnexaflow.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ipfs.io" />
        <link rel="dns-prefetch" href="https://api.ipfs.io" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
              <Analytics />
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
