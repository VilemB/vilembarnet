import Image from "next/image";

export default function Home() {
  return (<section className="min-h-screen px-6 md:px-12 lg:px-16">
    <div className="grid grid-cols-12 gap-5 items-center">

      <div className="col-span-12">
        <div className="flex flex-col leading-none">

          <h1 className="text-[clamp(4rem,18vw,18rem)] font-extralight">
            Vilém
          </h1>

          <h1 className="text-[clamp(4rem,18vw,18rem)] font-extralight -mt-[0.15em] text-right">
            Barnet
          </h1>

        </div>
      </div>

      <div className="col-span-3 col-start-2 ">
        <Image
          src="/website/vilem2.webp"
          alt="Hero"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>

    </div>
  </section>

  );
}
