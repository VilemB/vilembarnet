"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/all";
import Lenis from "lenis";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function ScrollNavbar() {
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const initNavbarAnimations = () => {
      const navbarBg = document.querySelector(".navbar-background");
      const navbarItems = document.querySelector(".navbar-items");
      const navbarLinks = document.querySelectorAll(".navbar-links");
      const navbarLogo = document.querySelector(".navbar-logo");

      const isDesktop = window.innerWidth >= 720;
      if (!isDesktop) {
        navbarLogo?.classList.add("navbar-logo-pinned");
        gsap.set(navbarLogo, { width: 250 });
        gsap.set([navbarBg, navbarItems], { width: "100%", height: "100vh" });
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const initialWidth = (navbarBg as HTMLElement)?.offsetWidth;
      const initialHeight = (navbarBg as HTMLElement)?.offsetHeight;
      const initialLinksWidths = Array.from(navbarLinks).map(
        (link) => (link as HTMLElement).offsetWidth
      );

      const state = Flip.getState(navbarLogo);
      navbarLogo?.classList.add("navbar-logo-pinned");
      gsap.set(navbarLogo, { width: 250 });
      const flip = Flip.from(state, { duration: 1, ease: "none", paused: true });

      ScrollTrigger.create({
        trigger: ".navbar-backdrop",
        start: "top top",
        end: `+=${viewportHeight}px`,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          gsap.set([navbarBg, navbarItems], {
            width: gsap.utils.interpolate(initialWidth, viewportWidth, p),
            height: gsap.utils.interpolate(initialHeight, viewportHeight, p),
          });

          navbarLinks.forEach((link, i) => {
            gsap.set(link, {
              width: gsap.utils.interpolate(
                (link as HTMLElement).offsetWidth,
                initialLinksWidths[i],
                p
              ),
            });
          });

          flip.progress(p);
        },
      });
    };

    initNavbarAnimations();

    let timer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.getAll().forEach((t) => t.kill());

        const navbarBg = document.querySelector(".navbar-background");
        const navbarItems = document.querySelector(".navbar-items");
        const navbarLinks = document.querySelectorAll(".navbar-links");
        const navbarLogo = document.querySelector(".navbar-logo");

        gsap.set([navbarBg, navbarItems, navbarLogo, ...navbarLinks], {
          clearProps: "all",
        });
        navbarLogo?.classList.remove("navbar-logo-pinned");

        initNavbarAnimations();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <>
      <div className="navbar-backdrop">
        <div className="navbar-img">
          <Image
            src="/website/bg.webp"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="navbar-background"></div>
      </div>

      <div className="navbar-items">
        <div className="navbar-links">
          <a href="/work">work</a>
          <a href="/about">about</a>
        </div>
        <div className="navbar-links">
          <a href="/blog">blog</a>
          <a href="mailto:barnetv7@gmail.com">contact</a>
        </div>

        <div className="navbar-logo">
          <a href="#">
            <Image
              src="/logos/logo.svg"
              alt="Logo"
              width={50}
              height={50}
              className="object-contain"
              priority
            />
          </a>
        </div>
      </div>

      <section className="hero">
        <h1>My name is Vilém Barnet</h1>
      </section>

      <section className="about">
        <h2>I enjoy designing and building digital products <span className="italic font-bold">from scratch.</span></h2>
      </section>
    </>
  );
}
