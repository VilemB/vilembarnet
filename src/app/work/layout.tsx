import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Selected Work',
  description: 'Selected projects by Vilém Barnet — web applications, UI/UX design, and branding. Featuring Studio Eclipse, Stepps.AI, Lumenapps, and Travist. Built with React, Next.js, and TypeScript.',
  openGraph: {
    title: 'Selected Work — Vilém Barnet',
    description: 'Selected projects by Vilém Barnet — web applications, UI/UX design, and branding work built with React, Next.js, and TypeScript.',
    url: 'https://barnetvilem.com/work',
  },
  twitter: {
    title: 'Selected Work — Vilém Barnet',
    description: 'Selected projects by Vilém Barnet — web applications, UI/UX design, and branding work built with React, Next.js, and TypeScript.',
  },
  alternates: {
    canonical: 'https://barnetvilem.com/work',
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
