import PixelatedText from "@/components/PixelatedText";
import PixelatedPhoto from "@/components/PixelatedPhoto";

export default function Home() {
  return (

    <section className="home">
      <div className="padding-section hero-content">
        <h2 className="home-heading">
          <span>web development</span>
          <span className="home-bullet">•</span>
          <span>design</span>
          <span className="home-bullet">•</span>
          <span>animation</span>
        </h2>
        <hr />
        <div className="pixelated-text">
          <PixelatedText>
            @barnetvilem
          </PixelatedText>
        </div>
        <hr />
      </div>

      <div className="padding-section hero-body">
        <div className="hero-image-container">
          <PixelatedPhoto
            src="/website/vilem3.webp"
            alt="Vilem Barnet"
            className="w-full h-full"
          />
        </div>
        <div className="hero-text-container">
          <p>
            Design should evoke emotion and feel natural. Through thoughtful design and development,
            I focus on creating digital experiences that are clear and intentional.
          </p>
        </div>
      </div>

      <div className="padding-section hero-cta">
        <div className="cta-row">
          <a href="/work">
            <span>explore&nbsp;</span>
            <span>my&nbsp;</span>
            <span>work</span>
          </a>
        </div>
        <hr />
        <div className="cta-row">
          <a href="/about">
            <span>get&nbsp;</span>
            <span>to&nbsp;</span>
            <span>know&nbsp;</span>
            <span>me</span>
          </a>
        </div>
        <hr />
        <div className="cta-row">
          <a href="/blog">
            <span>read&nbsp;</span>
            <span>my&nbsp;</span>
            <span>blog&nbsp;</span>
          </a>
        </div>
        <hr />
        <div className="cta-row">
          <a href="mailto:barnetv7@gmail.com">
            <span>get&nbsp;</span>
            <span>in&nbsp;</span>
            <span>touch</span>
          </a>
        </div>
      </div>


    </section>
  );
}
