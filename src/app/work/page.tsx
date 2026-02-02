'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
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
        // Creating distinct images for array provided (reusing same source for demo if needed, but logic supports multiple)
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
    const containerRef = useRef<HTMLDivElement>(null);
    const previewsContainerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const flatImages = useRef(flattenImages(projects)).current;

    useEffect(() => {
        if (!wrapperRef.current || !previewsContainerRef.current) return;

        const ctx = gsap.context(() => {
            // Measure total height of the content
            const previewsEl = previewsContainerRef.current!;
            const totalContentHeight = previewsEl.scrollHeight;
            const viewportHeight = window.innerHeight;

            // We want to scroll such that the last image eventually leaves or reaches top
            // Basically we scroll the entire height of the container minus the viewport height (or just to end)
            // But logic says: "based on the photo that is at the right spot (the initial place of the first photo)"
            // The initial place is top of container.
            // So we want to scroll until the last photo hits the top.
            // Distance = totalContentHeight. 
            // Actually, if we want the last photo to be active, we scroll until it hits top.
            // If we scroll further, it goes out.

            // Let's refine: We want to pin the section.
            // And scroll the preview column upwards.
            // Distance: We need to move the container UP by (totalContentHeight - heightOfLastItem).
            // This ensures last item stops at top.
            // Or maybe just scroll entire height?

            const lastItem = previewsEl.lastElementChild?.lastElementChild as HTMLElement; // unsafe assume structure
            // safer calculation:
            const maxTranslate = totalContentHeight - (viewportHeight / 2); // approximate

            // To be precise: We want to map scroll progress to the position of the previews.
            // Let's capture the offsets of each image wrapper relative to the container.
            const imageWrappers = gsap.utils.toArray<HTMLElement>('.work-preview-image-wrapper');
            const offsets = imageWrappers.map(el => el.offsetTop);

            // Pin distance: Make it feel substantial.
            const scrollDistance = totalContentHeight;

            ScrollTrigger.create({
                trigger: wrapperRef.current,
                start: 'top top',
                end: `+=${scrollDistance}`,
                pin: true,
                scrub: 0.5, // smooth scrubbing
                onUpdate: (self) => {
                    const progress = self.progress;
                    const currentScrollY = progress * (totalContentHeight - imageWrappers[0].offsetHeight); // Adjust max scroll

                    // Move the container
                    // We move it UP, so translateY is negative.
                    gsap.set(previewsEl, { y: -currentScrollY });

                    // Determine which item is active.
                    // The "active point" is the top of the container (y=0 relative to view).
                    // Since we translated container by -currentScrollY, the element at y=currentScrollY in original coords is now at 0.
                    // So we find the element whose offset is closest to currentScrollY.

                    // Simple search
                    let activeIndex = 0;
                    for (let i = 0; i < offsets.length; i++) {
                        // We check if the currentScrollY is within this item's zone.
                        // Zone is from its offset to next item's offset.
                        // Actually, simplified: "closest to top".
                        // If offsets[i] <= currentScrollY, it's a candidate.
                        // We want the one that has most recently passed or is passing the top.
                        if (currentScrollY >= offsets[i] - 100) { // -100 tolerance for entering
                            activeIndex = i;
                        }
                    }
                    setActiveFlatIndex(activeIndex);
                }
            });

        }, wrapperRef);

        return () => ctx.revert();
    }, [flatImages]);

    const activeItem = flatImages[activeFlatIndex];
    const activeProject = projects[activeItem.projectIndex];

    return (
        <section ref={wrapperRef} className="work-section">
            <div className="work-container">
                <div className="work-grid">
                    {/* Active Display */}
                    <div className="work-display">
                        <div className="work-display-image-container">
                            {/* Only show the current active photo */}
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
                        <div className="work-display-info">
                            <div className="work-display-number">
                                {activeProject.number}
                            </div>
                            <h2 className="work-display-title">
                                {activeProject.title}
                            </h2>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="work-navigation">
                        {/* Carousel */}
                        <div className="work-previews-col">
                            <div ref={previewsContainerRef} className="work-previews-container">
                                {projects.map((project, pIdx) => (
                                    <div key={project.id} className="work-project-group">
                                        {project.images.map((img, imgIdx) => {
                                            // Find global index for matching
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
                                                        width={500}
                                                        height={300}
                                                        className="work-preview-image"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* List - now driven by activeProject, not activeFlatIndex directly */}
                        <div className="work-list-col">
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`work-list-item ${index === activeItem.projectIndex ? 'active' : ''}`}
                                >
                                    <span className="accent-dot"></span>
                                    {project.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
