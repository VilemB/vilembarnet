import AnimatedIcosahedron from "@/components/AnimatedIcosahedron";

export default function About() {
  return (
    <section className="about">
      <div className="padding-section about-grid">
        {/* Left Column: Section Labels */}
        <nav className="about-nav">
          <ul>
            <li>INTRODUCTION</li>
            <li>MY JOURNEY</li>
            <li>CONTACT</li>
          </ul>
        </nav>

        {/* Center Column: Icosahedron */}
        <div className="about-visual">
          <AnimatedIcosahedron className="w-full h-full" />
        </div>

        {/* Right Column: Content */}
        <div className="about-content">
          <section className="about-section">
            <p>I'm Vilém Barnet, freelance web developer and designer based in the Czech Republic.</p>
          </section>

          <section className="about-section">
            <p>I started studying graphic design in 2021. Soon, I wanted to build complete digital products, so I learned web development.</p>
            <p>Since then, I've designed user interfaces and built several full-stack applications.</p>
            <p>Today, I focus on working on innovative and creative projects.</p>
          </section>

          <section className="about-section">
            <p>for business inquiries, contact me at barnetv7@gmail.com</p>
          </section>
        </div>
      </div>
    </section>
  );
}
