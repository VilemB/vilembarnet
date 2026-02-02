import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import LenisScroll from "@/components/LenisScroll";
import Navigation from "@/components/Navigation";

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#001F3D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vilembarnet.com"),
  title: {
    default: "Vilém Barnet | Full-Stack Engineer",
    template: "%s | Vilém Barnet",
  },
  description:
    "Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration. Building elegant web solutions that drive results.",
  authors: [{ name: "Vilém Barnet", url: "https://vilembarnet.com" }],
  creator: "Vilém Barnet",
  publisher: "Vilém Barnet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#001F3D",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://vilembarnet.com",
    siteName: "Vilém Barnet",
    title: "Vilém Barnet | Full-Stack Engineer",
    description:
      "Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration. Building elegant web solutions that drive results.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vilém Barnet - Full-Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vilém Barnet | Full-Stack Engineer",
    description:
      "Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration. Building elegant web solutions that drive results.",
    creator: "@barnetvilem",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://vilembarnet.com",
  },
  verification: {
    google: "googleeee94309a9949b14.html",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vilém Barnet",
  },
  formatDetection: {
    telephone: false,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vilém Barnet",
              jobTitle: "Full-Stack Engineer",
              description:
                "Full-Stack Engineer specializing in React, Next.js, TypeScript, and AI integration",
              url: "https://vilembarnet.com",
              sameAs: [
                "https://github.com/vilemb",
                "https://x.com/barnetvilem",
                "https://www.linkedin.com/in/vil%C3%A9m-barnet-497003365/",
              ],
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Node.js",
                "Python",
                "AI Integration",
                "Web Development",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${bricolageGrotesque.variable} antialiased`}
      >
        <LenisScroll />
        <div className="main-layout">
          <Navigation />
          <main>{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
