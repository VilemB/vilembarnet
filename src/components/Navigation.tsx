"use client";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex justify-between items-center">
      <div className="text-2xl font-heading text-dark">VB</div>
      <div className="flex gap-6 lg:gap-8 text-sm font-body">
        <a href="#work" className="text-dark hover:text-accent transition-colors">work</a>
        <a href="#about" className="text-dark hover:text-accent transition-colors">about</a>
        <a href="#contact" className="text-dark hover:text-accent transition-colors">contact</a>
        <a href="/blog" className="text-dark hover:text-accent transition-colors">blog</a>
      </div>
    </nav>
  );
}
