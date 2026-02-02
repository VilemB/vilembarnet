'use client';

import React, { useEffect, useRef, useState } from 'react';
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
        images: ['/website/work/eclipse-studio.webp', '/website/work/eclipse-studio.webp']
    },
    {
        id: 2,
        number: '02',
        title: 'Stepps.AI',
        images: ['/website/work/stepps.webp']
    },
    {
        id: 3,
        number: '03',
        title: 'Lumenapps',
        images: ['/website/work/lumenapps.webp']
    },
    {
        id: 4,
        number: '04',
        title: 'Travist',
        images: ['/website/work/travist.webp']
    }
];

// Flat list helper for indexing
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

        // Scroll distance
        // Logic: Pin for the duration it takes to scroll all items past the view point.
        const scrollDistance = totalContentHeight * 1.5;

        ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                // Move previews up
                const yPos = progress * totalContentHeight;
                gsap.set(previewsEl, { y: -yPos });

                // Simple hit detection based on "active zone" (approx 30vh down based on CSS)
                const imageWrappers = gsap.utils.toArray<HTMLElement>('.work-preview-image-wrapper');
                let activeIndex = 0;

                // Find item currently in the "sweet spot"
                // Since we translate Y UP by yPos, we look for offsetTop that is close to yPos.
                for (let i = 0; i < imageWrappers.length; i++) {
                    if (yPos >= imageWrappers[i].offsetTop - 150) { // Tolerance
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

        // Update ref for next render *after* we determine direction
        // But we need to use the OLD value for direction logic now.

        const activeItem = flatImages[currentFlatIndex];
        const prevItem = flatImages[prevFlatIndex];

        // Only animate if project changed (or handled multiple images same project?)
        // Request implies "project changes".
        if (activeItem.projectId !== prevItem.projectId || currentFlatIndex === prevFlatIndex) {
            // Determine direction
            // If active > prev, we are scrolling DOWN (next projects), so text should slide UP?
            // "if he came from project 2 to project 3 [next], it should slide up"
            // "if he came from project 4 to project 3 [prev], it should slide down"
            const direction = currentFlatIndex > prevFlatIndex ? 1 : -1;

            // Animation values
            const yOffset = 100 * direction; // Slide UP (+100 to 0? No, from 100 to 0 is up. from -100 to 0 is down?)
            // If we go 2->3 (Next), we want it to verify. 
            // Usually "slide up" means enters from bottom. y: 100 -> 0.
            // "slide down" means enters from top. y: -100 -> 0.

            const fromY = direction === 1 ? '100%' : '-100%';

            // Animate Number (Simple fade/slide)
            if (numberRef.current) {
                gsap.fromTo(numberRef.current,
                    { y: fromY, opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.5, ease: "power3.out", overwrite: true }
                );
            }

            // Animate Title (Character by Character)
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
                            ease: "back.out(1.7)", // bouncy?
                            overwrite: true
                        }
                    );
                }
            }
        }

        // Animate Dot (Always update position)
        const listItem = listItemsRef.current[activeItem.projectIndex];
        if (listItem && dotRef.current) {
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

    // Split title helper
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
