import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work & Projects',
  description: 'Explore my portfolio of web applications, design projects, and branding work. Featuring Studio Eclipse, Stepps.AI, Lumenapps, and Travist.',
  openGraph: {
    title: 'Work & Projects | Vilém Barnet',
    description: 'Explore my portfolio of web applications, design projects, and branding work.',
    url: 'https://barnetvilem.com/work',
  },
  twitter: {
    title: 'Work & Projects | Vilém Barnet',
    description: 'Explore my portfolio of web applications, design projects, and branding work.',
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
