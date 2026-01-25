import PixelatedText from "@/components/PixelatedText";

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center h-screen">

        <div className="">
          <p>
            Design should evoke emotion and feel natural. Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.
          </p>
        </div>
        <div className="pixelated-text">
          <PixelatedText className="absolute bottom-0">
            barnetvilem
          </PixelatedText>
        </div>

        <div className="bg-dark h-[20svh] w-full rounded-t-2xl">

        </div>

      </section>
    </>
  );
}
