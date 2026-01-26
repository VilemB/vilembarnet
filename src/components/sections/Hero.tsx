import PixelatedText from "../PixelatedText";
import Navbar from "../Navbar";

export default function Hero() {
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
          <img src="/website/vilem3.webp" alt="Vilem Barnet" />
        </div>
        <div className="hero-text-container">
          <p>
            Design should evoke emotion and feel natural. Through thoughtful design and development,
            I focus on creating digital experiences that are clear and intentional.
          </p>
        </div>
      </div>


    </section>
  );
}
