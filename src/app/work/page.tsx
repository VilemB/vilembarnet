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
        title: 'Strata',
        images: ['/website/work/strata1.webp']
    },
    {
        id: 2,
        number: '02',
        title: 'Studio Eclipse',
        images: ['/website/work/eclipse-studio1.webp']
    },
    {
        id: 3,
        number: '03',
        title: 'Stepps.AI',
        images: ['/website/work/stepps1.webp', '/website/work/stepps2.webp', '/website/work/stepps3.webp', '/website/work/stepps4.webp']
    },
    {
        id: 4,
        number: '04',
        title: 'Lumenapps',
        images: ['/website/work/lumenapps1.webp', '/website/work/lumenapps2.webp']
    },
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
    const prevFlatIndexRef = useRef(0);

    const previewsContainerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Refs for animated elements
    const numberRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const dotRef = useRef<HTMLSpanElement>(null);
    const listItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    const flatImages = useRef(flattenImages(projects)).current;

    useGSAP(() => {
        if (!wrapperRef.current || !previewsContainerRef.current) return;

        const previewsEl = previewsContainerRef.current!;
        const totalContentHeight = previewsEl.scrollHeight;

        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        const activeZoneOffset = isMobile
            ? window.innerHeight * 0.15
            : window.innerHeight * 0.3;
        const scrollDistance = Math.max(
            totalContentHeight,
            totalContentHeight - (window.innerHeight - activeZoneOffset)
        );

        ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const currentY = progress * totalContentHeight;

                gsap.set(previewsEl, { y: -progress * totalContentHeight });

                const imageWrappers = gsap.utils.toArray<HTMLElement>('.work-preview-image-wrapper');
                let activeIndex = 0;
                let minDiff = Infinity;

                for (let i = 0; i < imageWrappers.length; i++) {
                    const diff = Math.abs(currentY - imageWrappers[i].offsetTop);
                    if (diff < minDiff) {
                        minDiff = diff;
                        activeIndex = i;
                    }
                }
                setActiveFlatIndex(activeIndex);
            }
        });

    }, { scope: wrapperRef });

    useGSAP(() => {
        const currentFlatIndex = activeFlatIndex;
        const prevFlatIndex = prevFlatIndexRef.current;

        const activeItem = flatImages[currentFlatIndex];
        const prevItem = flatImages[prevFlatIndex];

        if (activeItem.projectId !== prevItem.projectId || currentFlatIndex === prevFlatIndex) {
            const direction = currentFlatIndex >= prevFlatIndex ? 1 : -1;
            const fromY = direction === 1 ? '60%' : '-60%';

            if (numberRef.current) {
                gsap.fromTo(numberRef.current,
                    { y: fromY, opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.6, ease: "power4.out", overwrite: true }
                );
            }

            if (titleRef.current) {
                const chars = titleRef.current.querySelectorAll('.char');
                if (chars.length > 0) {
                    gsap.fromTo(chars,
                        { y: fromY, opacity: 0 },
                        {
                            y: '0%',
                            opacity: 1,
                            duration: 0.6,
                            stagger: 0.025,
                            ease: "power4.out",
                            overwrite: true
                        }
                    );
                }
            }
        }

        const listItem = listItemsRef.current[activeItem.projectIndex];
        if (listItem && dotRef.current) {
            const activeY = listItem.offsetTop;
            const itemHeight = listItem.offsetHeight;
            const dotY = activeY + (itemHeight / 2) - 5;

            gsap.to(dotRef.current, {
                y: dotY,
                duration: 0.5,
                ease: "power3.out",
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

                    <div className="work-navigation">
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
