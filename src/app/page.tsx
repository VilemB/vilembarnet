import PixelatedText from "@/components/PixelatedText";

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center h-screen">

        <div className="flex-1 flex-row items-center justify-center">
          <p>
            Design should evoke emotion and feel natural. Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.
          </p>
          <div>
            
          </div>
        </div>
        <div className="pixelated-text">
          <PixelatedText className="absolute bottom-0">
            @barnetvilem
          </PixelatedText>
        </div>

      </section>
    </>
  );
}
