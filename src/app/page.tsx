import PixelatedText from "@/components/PixelatedText";

export default function Home() {
  return (
    <>
      <section className="home">
        <div className="home-top-row">
          <div className="home-content-cell">
            <h2 className="home-heading">
              web development <span className="home-bullet">•</span> design
            </h2>
            <p className="home-description">
              Design should evoke emotion and feel natural. Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.
            </p>
          </div>

          <div className="home-empty-cell">
          </div>
        </div>

        <div className="home-bottom-row">
          <div className="pixelated-text">
            <PixelatedText>
              @barnetvilem
            </PixelatedText>
          </div>
        </div>
      </section>
    </>
  );
}
