import PixelatedText from "@/components/PixelatedText";

export default function Home() {
  return (
    <>
      <section className="flex flex-col h-screen p-8 md:p-16 gap-4">
        <div className="flex flex-row flex-1 gap-4">
          <div className="flex-1 flex flex-col justify-start">
            <h2 className="text-xl md:text-2xl font-medium mb-6">
              web development <span className="mx-2">•</span> design
            </h2>
            <p className="text-base md:text-lg leading-relaxed max-w-lg">
              Design should evoke emotion and feel natural. Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.
            </p>
          </div>

          <div className="flex-1">
          </div>
        </div>

        <div className="flex-1 flex items-end justify-center">
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
