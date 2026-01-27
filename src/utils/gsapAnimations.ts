import gsap from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

/**
 * @param element - The element to animate on hover
 */
export const textHoverAnimation = (
  element: HTMLElement,
) => {

  const handleMouseEnter = (splitText: SplitText) => {

    gsap.to(splitText.chars, {
      fontStyle: "italic",
      stagger: 0.08,
      ease: "power3.out",
    })
  };

  const handleMouseLeave = (splitText: SplitText) => {
    
    gsap.fromTo(splitText.chars, {
      fontStyle: "italic",
    }, {
      fontStyle: "normal",
      stagger: 0.08,
      ease: "power3.out",
    })
  };

  element.addEventListener("mouseenter", () => {
    const splitText = new SplitText(element, {
      type: "chars",
      charsClass: "char",
    });
    handleMouseEnter(splitText);
  });

  element.addEventListener("mouseleave", () => {
    const splitText = new SplitText(element, {
      type: "chars",
      charsClass: "char",
    });
    handleMouseLeave(splitText);
  });

  return () => {
    element.removeEventListener("mouseenter", () => {
      const splitText = new SplitText(element, {
        type: "chars",
        charsClass: "char",
      });
      handleMouseEnter(splitText);
    });
    element.removeEventListener("mouseleave", () => {
      const splitText = new SplitText(element, {
        type: "chars",
        charsClass: "char",
      });
      handleMouseLeave(splitText);
    });
  };
};
