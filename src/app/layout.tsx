import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import LenisScroll from "@/components/LenisScroll";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#201E43",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://barnetvilem.com"),
  title: {
    default: "Vilém Barnet — Developer & Designer",
    template: "%s — Vilém Barnet",
  },
  description:
    "Vilém Barnet — freelance full-stack developer and web designer. I build high-performance websites, web apps, and brands using React, Next.js, and TypeScript. Available for hire.",
  keywords: [
    "Vilém Barnet",
    "Vilem Barnet",
    "full-stack developer",
    "web developer",
    "web designer",
    "freelance developer",
    "React developer",
    "Next.js developer",
    "TypeScript developer",
    "frontend developer",
    "web design",
    "web applications",
    "branding",
    "UI design",
    "portfolio",
  ],
  authors: [{ name: "Vilém Barnet", url: "https://barnetvilem.com" }],
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
        color: "#201E43",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://barnetvilem.com",
    siteName: "Vilém Barnet",
    title: "Vilém Barnet — Developer & Designer",
    description:
      "Freelance full-stack developer and web designer building high-performance websites, web apps, and brands with React, Next.js, and TypeScript.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vilém Barnet — Developer & Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vilém Barnet — Developer & Designer",
    description:
      "Freelance full-stack developer and web designer building high-performance websites, web apps, and brands with React, Next.js, and TypeScript.",
    creator: "@barnetvilem",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://barnetvilem.com",
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
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://barnetvilem.com/#person",
                  name: "Vilém Barnet",
                  alternateName: "Vilem Barnet",
                  jobTitle: "Full-Stack Developer & Web Designer",
                  description:
                    "Freelance full-stack developer and web designer specializing in React, Next.js, TypeScript, and modern web technologies. Building high-performance websites, web applications, and brand identities.",
                  url: "https://barnetvilem.com",
                  email: "barnetv7@gmail.com",
                  sameAs: [
                    "https://github.com/vilemb",
                    "https://x.com/barnetvilem",
                    "https://www.linkedin.com/in/vil%C3%A9m-barnet-497003365/",
                    "https://instagram.com/barnetvilem",
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
                    "Web Design",
                    "UI/UX Design",
                    "GSAP",
                    "Branding",
                    "Three.js",
                    "Tailwind CSS",
                  ],
                  makesOffer: [
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Web Application Development",
                        description:
                          "Custom web application development using React, Next.js, and TypeScript",
                      },
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Web Design",
                        description:
                          "Modern, responsive web design with clean structure and considered motion",
                      },
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Branding",
                        description:
                          "Brand identity design including logos, visual systems, and brand guidelines",
                      },
                    },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://barnetvilem.com/#website",
                  url: "https://barnetvilem.com",
                  name: "Vilém Barnet — Developer & Designer",
                  publisher: {
                    "@id": "https://barnetvilem.com/#person",
                  },
                },
                {
                  "@type": "ProfilePage",
                  "@id": "https://barnetvilem.com/#profilepage",
                  url: "https://barnetvilem.com",
                  name: "Vilém Barnet Portfolio",
                  mainEntity: {
                    "@id": "https://barnetvilem.com/#person",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${bricolageGrotesque.variable} antialiased`}
      >
        <PageTransition />
        <LenisScroll />
        <div className="main-layout">
          <Navigation />
          <main>{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
