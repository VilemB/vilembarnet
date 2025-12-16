import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vilembarnet.vercel.app'),
  title: {
    default: "Vilém Barnet | Full-Stack Engineer",
    template: "%s | Vilém Barnet"
  },
  description: "Vilém Barnet is a Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration. Building elegant web solutions that drive results.",
  keywords: [
    "Vilém Barnet",
    "Full-Stack Engineer",
    "Freelance Developer",
    "AI Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Český Programátor",
    "Czech Programmer",
    "Vývojář",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Software Engineer",
    "JavaScript Developer",
    "Node.js Developer",
    "AI Integration",
    "LLM Integration",
    "OpenAI API",
    "MongoDB Developer",
    "Supabase Developer",
    "Tailwind CSS",
    "Czech Republic Developer",
    "eČtenářák",
    "GenCards",
    "Sofia App",
    "Portfolio Website",
    "Freelance Developer",
    "Web Solutions",
    "Modern Web Development",
    "UI/UX Design",
    "Figma Design",
    "REST APIs",
    "Python Developer",
    "FastAPI Developer",
    "LangChain Developer",
    "LangGraph Developer",
    "Instructor Developer",
    "OpenAI SDK Developer",
    "LlamaIndex Developer",
    "n8n Developer",
    "MongoDB Developer",
    "Supabase Developer",
    "Tailwind CSS Developer",
    "Web Development Prague",
  ],
  authors: [{ name: "Vilém Barnet" }],
  creator: "Vilém Barnet",
  publisher: "Vilém Barnet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://vilembarnet.vercel.app',
    siteName: 'Vilém Barnet Portfolio',
    title: 'Vilém Barnet | Full-Stack Engineer',
    description: 'Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration. Building elegant web solutions that drive results.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vilém Barnet - Full-Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vilém Barnet | Full-Stack Engineer',
    description: 'Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration. Building elegant web solutions that drive results.',
    creator: '@barnetvilem',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://vilembarnet.vercel.app',
  },
  category: 'Technology',
  verification: {
    google: 'googleeee94309a9949b14.html',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Vilém Barnet',
              jobTitle: 'Full-Stack Engineer & Digital Solutions Architect',
              description: 'Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration',
              url: 'https://vilembarnet.com',
              sameAs: [
                'https://github.com/vilemb',
                'https://x.com/barnetvilem',
                'https://www.linkedin.com/in/vil%C3%A9m-barnet-497003365/',
                'https://medium.com/@barnetvilem'
              ],
              knowsAbout: [
                'React',
                'Next.js',
                'TypeScript',
                'JavaScript',
                'Node.js',
                'Python',
                'AI Integration',
                'Web Development',
                'Frontend Development',
                'Backend Development'
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance'
              }
            })
          }}
        />
        <script data-site="dHJhY2tfYmRhc3U0ZXg=" src="https://oculisanalytics.com/js/script.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-24 px-4 pb-4">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
