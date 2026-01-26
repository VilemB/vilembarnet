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
    </section>
  );
}
