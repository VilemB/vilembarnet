"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="nav">
      <Image src="/logos/logo.png" alt="Logo" width={40} height={40} />
      <div className="nav-links">
        <Link href="/work" className="text-dark hover:text-accent transition-colors">work</Link>
        <Link href="/about" className="text-dark hover:text-accent transition-colors">about</Link>
        <Link href="mailto:barnetv7@gmail.com" className="text-dark hover:text-accent transition-colors">contact</Link>
        <Link href="/blog" className="text-dark hover:text-accent transition-colors">blog</Link>
      </div>
    </nav>
  );
}
