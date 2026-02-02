'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Project = {
    id: number;
    number: string;
    title: string;
    images: string[];
    link?: string;
};

const projects: Project[] = [
    {
        id: 1,
        number: '01',
        title: 'Studio Eclipse',
        images: ['/website/work/eclipse-studio1.webp']
    },
    {
        id: 2,
        number: '02',
        title: 'Stepps.AI',
        images: ['/website/work/stepps1.webp', '/website/work/stepps2.webp', '/website/work/stepps3.webp', '/website/work/stepps4.webp']
    },
    {
        id: 3,
        number: '03',
        title: 'Lumenapps',
        images: ['/website/work/lumenapps1.webp', '/website/work/lumenapps2.webp']
    },
    {
        id: 4,
        number: '04',
        title: 'Travist',
        images: ['/website/work/travist1.webp']
    }
];

type FlatImage = {
    uniqueId: string;
    projectId: number;
    projectIndex: number;
    imageSrc: string;
    indexInProject: number;
};

const flattenImages = (projs: Project[]): FlatImage[] => {
    const flat: FlatImage[] = [];
    projs.forEach((p, pIdx) => {
        p.images.forEach((img, imgIdx) => {
            flat.push({
                uniqueId: `${p.id}-${imgIdx}`,
                projectId: p.id,
                projectIndex: pIdx,
                imageSrc: img,
                indexInProject: imgIdx
            });
        });
    });
    return flat;
};

export default function WorkPage() {
    const [activeFlatIndex, setActiveFlatIndex] = useState(0);
    // Track previous flat index to determine direction
    const prevFlatIndexRef = useRef(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const previewsContainerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Refs for animated elements
    const numberRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const dotRef = useRef<HTMLSpanElement>(null);
    const listItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    const flatImages = useRef(flattenImages(projects)).current;

    // Scroll Logic
    useGSAP(() => {
        if (!wrapperRef.current || !previewsContainerRef.current) return;

        const previewsEl = previewsContainerRef.current!;
        const totalContentHeight = previewsEl.scrollHeight;

        // Exact scroll distance calculation to prevent dead zones
        // The "viewport" for previews is effectively how much vertical space they have in the design (height: 100% of container).
        // We want to scroll until the END of the preview strip hits the END of the viewport.
        // Or specific logic: Scroll so the last item reaches the activation point?

        // Current issue: "scrolls back up, it doesn't do anything until he reaches some point".
        // This implies the ScrollTrigger `end` is much further than the visual content, so you have to scroll up through empty space before the `scrub` value changes significantly enough to move content back into view.

        // Fix: Tighter coupling of scrollDistance to visual height.
        // We are scrubbing `y` from 0 to -totalContentHeight.
        // We want this full animation to happen over a distance of `totalContentHeight`.

        // Calculate precise scroll distance to prevent dead zones
        // Ensures last preview reaches active zone exactly at progress = 1
        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        const activeZoneOffset = isMobile
            ? window.innerHeight * 0.15  // 15vh margin-top on mobile (work.css line 300)
            : window.innerHeight * 0.3;   // 30vh margin-top on desktop (work.css line 133)
        const scrollDistance = Math.max(
            totalContentHeight,
            totalContentHeight - (window.innerHeight - activeZoneOffset)
        );

        ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 0, // Make it instant responsive to remove lag feeling
            anticipatePin: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                // Move previews up
                // We map progress (0-1) to the translation Y
                // Max translation should ensure last item is visible at the "sweet spot".
                // If we translate by full height, it might go too far.
                // Let's cap translation so the last item stops *at* the active zone.
                // But simple approach: Translate full height for now, adjust visually.

                const yPos = progress * (totalContentHeight - window.innerHeight * 0.5); // Stop earlier?
                // Actually, if we just translate by totalHeight, eventually it goes off screen.
                // Let's rely on standard scrolling physics feeling.

                gsap.set(previewsEl, { y: -progress * totalContentHeight });

                // Active detection
                const currentY = progress * totalContentHeight;
                const imageWrappers = gsap.utils.toArray<HTMLElement>('.work-preview-image-wrapper');

                // We need to find which item is at the "active line".
                // Active line is defined by CSS margin-top (30vh approx).
                // So we want item where `item.offsetTop - currentY ≈ 0`.

                let activeIndex = 0;
                let minDiff = Infinity;

                for (let i = 0; i < imageWrappers.length; i++) {
                    const diff = Math.abs(currentY - imageWrappers[i].offsetTop);
                    // Bias slightly towards allowing the next one to snap in early?
                    if (diff < minDiff) {
                        minDiff = diff;
                        activeIndex = i;
                    }
                }
                setActiveFlatIndex(activeIndex);
            }
        });

    }, { scope: wrapperRef });

    // Animation Logic (Text, Dot, Directional)
    useGSAP(() => {
        const currentFlatIndex = activeFlatIndex;
        const prevFlatIndex = prevFlatIndexRef.current;

        const activeItem = flatImages[currentFlatIndex];
        const prevItem = flatImages[prevFlatIndex];

        if (activeItem.projectId !== prevItem.projectId || currentFlatIndex === prevFlatIndex) {
            const direction = currentFlatIndex >= prevFlatIndex ? 1 : -1;
            const fromY = direction === 1 ? '100%' : '-100%';

            // Animate Number 
            if (numberRef.current) {
                gsap.fromTo(numberRef.current,
                    { y: fromY, opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.5, ease: "power3.out", overwrite: true }
                );
            }

            // Animate Title
            if (titleRef.current) {
                const chars = titleRef.current.querySelectorAll('.char');
                if (chars.length > 0) {
                    gsap.fromTo(chars,
                        { y: fromY, opacity: 0 },
                        {
                            y: '0%',
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.02,
                            ease: "back.out(1.7)",
                            overwrite: true
                        }
                    );
                }
            }
        }

        // Animate Dot 
        const listItem = listItemsRef.current[activeItem.projectIndex];
        if (listItem && dotRef.current) {
            // Need to account for potential scrolling of the list wrapper if it was scrollable?
            // Currently list is fixed position effectively. 
            const activeY = listItem.offsetTop;
            const itemHeight = listItem.offsetHeight;
            const dotY = activeY + (itemHeight / 2) - 5;

            gsap.to(dotRef.current, {
                y: dotY,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        }

        prevFlatIndexRef.current = currentFlatIndex;

    }, [activeFlatIndex]);

    const activeItem = flatImages[activeFlatIndex];
    const activeProject = projects[activeItem.projectIndex];

    const splitTitle = (text: string) => {
        return text.split('').map((char, i) => (
            <span key={i} className="char" style={{ display: 'inline-block', minWidth: char === ' ' ? '0.5em' : 'auto' }}>
                {char}
            </span>
        ));
    };

    return (
        <section ref={wrapperRef} className="work-section">
            <div className="work-container">
                <div className="work-grid">
                    {/* Display Section */}
                    <div className="work-display">
                        <div className="work-display-info">
                            <div className="work-display-number" style={{ overflow: 'hidden' }}>
                                <div ref={numberRef}>
                                    {activeProject.number}
                                </div>
                            </div>
                            <div className="work-display-title-wrapper" style={{ overflow: 'hidden' }}>
                                <h2 ref={titleRef} className="work-display-title">
                                    {splitTitle(activeProject.title)}
                                </h2>
                            </div>
                        </div>
                        <div className="work-display-image-container">
                            {flatImages.map((item, index) => (
                                <Image
                                    key={item.uniqueId}
                                    src={item.imageSrc}
                                    alt={`${projects[item.projectIndex].title} ${item.indexInProject + 1}`}
                                    fill
                                    className="work-display-image"
                                    style={{
                                        opacity: index === activeFlatIndex ? 1 : 0,
                                        zIndex: index === activeFlatIndex ? 1 : 0
                                    }}
                                    priority={index === 0}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="work-navigation">
                        {/* Previews */}
                        <div className="work-previews-col">
                            <div ref={previewsContainerRef} className="work-previews-container">
                                {projects.map((project, pIdx) => (
                                    <div key={project.id} className="work-project-group">
                                        {project.images.map((img, imgIdx) => {
                                            const globalIndex = flatImages.findIndex(
                                                f => f.projectId === project.id && f.indexInProject === imgIdx
                                            );
                                            return (
                                                <div
                                                    key={`${project.id}-${imgIdx}`}
                                                    className={`work-preview-image-wrapper ${globalIndex === activeFlatIndex ? 'active' : ''}`}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt="preview"
                                                        width={300}
                                                        height={200}
                                                        className="work-preview-image"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="work-list-col">
                            <div className="work-list-items-container">
                                <span ref={dotRef} className="accent-dot-absolute"></span>
                                {projects.map((project, index) => (
                                    <div
                                        key={project.id}
                                        ref={el => { listItemsRef.current[index] = el; }}
                                        className={`work-list-item ${index === activeItem.projectIndex ? 'active' : ''}`}
                                    >
                                        {project.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
