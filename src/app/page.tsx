import Image from "next/image";

export default function Home() {
  return (<section className="min-h-screen px-6 md:px-12 lg:px-16">
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-12">
        <h1 className="text-[clamp(4rem,18vw,18rem)] font-extralight leading-none">
          Vilém
        </h1>
      </div>

      <div className="col-span-1 col-start-1 self-end">
        <Image
          src="/logos/logo.svg"
          alt="Hero"
          width={50}
          height={50}
          className="w-1/2 h-auto"
        />
      </div>

      <div className="col-span-3 col-start-2 self-end">
        <Image
          src="/website/vilem2.webp"
          alt="Hero"
          width={500}
          height={500}
          className="w-full h-auto"
          style={{ filter: "grayscale(100%)" }}
        />
      </div>

      <div className="col-span-8 self-start">
        <h1 className="text-[clamp(4rem,20vw,18rem)] font-extralight leading-none text-right m-0">
          Barnet
        </h1>
      </div>

    </div>
  </section>

  );
}
