import PixelatedText from "../PixelatedText";
import Navbar from "../Navbar";

export default function Hero() {
  return (
    <section className="home">
      <Navbar />
      <div className="home-top-row">
        <div className="home-content-cell">
          <h2 className="home-heading">
            web development <span className="home-bullet">•</span> design
          </h2>
          <p className="home-description">
            design should evoke emotion and feel natural. through thoughtful design and development, i focus on creating digital experiences that are clear and intentional.
          </p>
        </div>

        <div className="home-empty-cell">
        </div>
      </div>

      <div className="pixelated-text">
        <PixelatedText>
          @barnetvilem
        </PixelatedText>
      </div>
    </section>
  );
}
