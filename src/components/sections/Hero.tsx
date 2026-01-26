import PixelatedText from "../PixelatedText";
import Navbar from "../Navbar";

export default function Hero() {
  return (
    <section className="home">
      <Navbar />
      <div className="padding-section">
        <h2 className="home-heading">
          web development <span className="home-bullet">•</span> design <span className="home-bullet">•</span> animation
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
