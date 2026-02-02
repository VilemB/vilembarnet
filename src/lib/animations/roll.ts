import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
    gsap.registerPlugin(SplitText);
}

export function initRollAnimation(element: HTMLElement) {
    if (!element) return;

    const split = new SplitText(element, { type: "chars" });
    const chars = split.chars;
    const clones: HTMLElement[] = [];
    chars.forEach((char) => {
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        wrapper.style.verticalAlign = "top";
        wrapper.style.position = "relative";

        char.parentNode?.insertBefore(wrapper, char);
        wrapper.appendChild(char);

        const clone = char.cloneNode(true) as HTMLElement;
        clone.style.position = "absolute";
        clone.style.top = "100%";
        clone.style.left = "0";
        clone.style.width = "100%";
        clone.style.height = "100%";
        wrapper.appendChild(clone);
        clones.push(clone);
    });

    const handleEnter = () => {
        gsap.to(chars, {
            yPercent: -100,
            duration: 0.5,
            ease: "power3.inOut",
            stagger: 0.015,
            overwrite: true
        });
        gsap.to(clones, {
            yPercent: -100,
            duration: 0.5,
            ease: "power3.inOut",
            stagger: 0.015,
            overwrite: true
        });
    };

    const handleLeave = () => {
        gsap.to(chars, {
            yPercent: 0,
            duration: 0.5,
            ease: "power3.inOut",
            stagger: 0.015,
            overwrite: true
        });
        gsap.to(clones, {
            yPercent: 0,
            duration: 0.5,
            ease: "power3.inOut",
            stagger: 0.015,
            overwrite: true
        });
    };

    element.addEventListener("mouseenter", handleEnter);
    element.addEventListener("mouseleave", handleLeave);

    return () => {
        element.removeEventListener("mouseenter", handleEnter);
        element.removeEventListener("mouseleave", handleLeave);
        split.revert();
    };
}
