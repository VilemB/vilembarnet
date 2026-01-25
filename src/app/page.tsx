import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (<section className="min-h-screen px-6 md:px-12 lg:px-16">
    <div className="grid grid-cols-12 gap-5">

      <div className="col-span-9">
        <h1 className="text-[clamp(4rem,18vw,18rem)] font-extralight leading-none">
          Vilém
        </h1>
      </div>

      <div className="col-span-3 col-start-10 self-center">
        <h3 className="text-right leading-[1.9] text-[clamp(1rem,1.5vw,2rem)]">
          WEB DEVELOPMENT <span className="text-accent">/</span><br />
          DESIGN <span className="text-accent">/</span><br />
          BRANDING <span className="text-accent">/</span>
        </h3>
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

      <div className="col-span-4 col-start-1">
        <p className="text-[clamp(0.7rem,0.4vw,1.5rem)]">Design should evoke emotion and feel natural. Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.</p>
      </div>

      <div className="col-span-1 col-start-12 flex flex-col gap-2">
        <a href="/work" className="inline-flex items-center gap-2">
          <h3 className="text-[clamp(1rem,1.5vw,2rem)]">WORK</h3>
          <ArrowRight className="rotate-[-45deg] stroke-[1.5px]" />
        </a>

        <a href="/about" className="inline-flex items-center gap-2">
          <h3 className="text-[clamp(1rem,1.5vw,2rem)]">ABOUT</h3>
          <ArrowRight className="rotate-[-45deg] stroke-[1.5px]" />
        </a>

        <a href="/blog" className="inline-flex items-center gap-2">
          <h3 className="text-[clamp(1rem,1.5vw,2rem)]">BLOG</h3>
          <ArrowRight className="rotate-[-45deg] stroke-[1.5px]" />
        </a>

        <a href="/contact" className="inline-flex items-center gap-2">
          <h3 className="text-[clamp(1rem,1.5vw,2rem)]">CONTACT</h3>
          <ArrowRight className="rotate-[-45deg] stroke-[1.5px]" />
        </a>
      </div>

    </div>
  </section>

  );
}
