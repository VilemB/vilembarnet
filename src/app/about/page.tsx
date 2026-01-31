import AnimatedIcosahedron from "@/components/AnimatedIcosahedron";

export default function About() {
  return (
    <section className="about-container">
      <div className="padding-section about-grid">

        <div className="about-visual area-visual">
          <AnimatedIcosahedron className="icosahedron-wrapper" />
        </div>

        <h2 className="about-label area-label-intro">INTRODUCTION</h2>
        <div className="about-text area-text-intro">
          <p>I'm Vilém Barnet, freelance web developer and designer based in the Czech Republic.</p>
        </div>

        <h2 className="about-label area-label-journey">MY JOURNEY</h2>
        <div className="about-text area-text-journey">
          <p>I started studying graphic design in 2021. Soon, I wanted to build complete digital products, so I learned web development.</p>
          <p>Since then, I've designed user interfaces and built several full-stack applications.</p>
          <p>Today, I focus on working on innovative and creative projects.</p>
        </div>

        <h2 className="about-label area-label-contact">CONTACT</h2>
        <div className="about-text area-text-contact">
          <p>for business inquiries, contact me at <a href="mailto:barnetv7@gmail.com" className="email-link">barnetv7@gmail.com</a></p>
        </div>
      </div>
    </section>
  );
}
