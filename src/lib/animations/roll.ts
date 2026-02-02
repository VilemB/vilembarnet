import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
    gsap.registerPlugin(SplitText);
}

/**
 * Creates a "roll" animation on hover.
 * The text slides up and out, while a duplicate copy slides up from bottom into place.
 */
export function initRollAnimation(element: HTMLElement) {
    if (!element) return;

    // Split into characters
    const split = new SplitText(element, { type: "chars" });
    const chars = split.chars;
    const clones: HTMLElement[] = [];

    // Wrap each char in an overflow-hidden wrapper
    chars.forEach((char) => {
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        wrapper.style.verticalAlign = "top";
        wrapper.style.position = "relative";

        // Move char inside wrapper
        char.parentNode?.insertBefore(wrapper, char);
        wrapper.appendChild(char);

        // Add duplicate char for the roll effect
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
