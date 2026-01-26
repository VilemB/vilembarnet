import Navbar from "@/components/Navbar";
import PixelatedText from "@/components/PixelatedText";
import PixelatedPhoto from "@/components/PixelatedPhoto";

export default function Home() {
  return (

    <section className="home">
      <Navbar />
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
          <span>explore</span>
          <span>my</span>
          <span>work</span>
        </div>
        <hr />
        <div className="cta-row">
          <span>get</span>
          <span>to</span>
          <span>know</span>
          <span>me</span>
        </div>
        <hr />
        <div className="cta-row">
          <span>read</span>
          <span>my</span>
          <span>blog</span>
        </div>
        <hr />
        <div className="cta-row">
          <span>get</span>
          <span>in</span>
          <span>touch</span>
        </div>
      </div>


    </section>
  );
}
