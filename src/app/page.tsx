"use client";

import Footer from "@/components/Footer";
import { animate, stagger } from "animejs";
import React, { useState, useEffect, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";

// Define project data array
const projectsData: ProjectCardProps[] = [
  {
    title: "Project Title 1",
    description:
      "Brief description of the project, highlighting key technologies or contributions. Made this one a bit longer to test the flex-grow property.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    demoUrl: "#",
    codeUrl: "#",
    // Event handlers will be passed in the map function
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
  },
  {
    title: "Project Title 2",
    description:
      "Another project description, perhaps focusing on different skills or outcomes.",
    tags: ["React", "Node.js", "CSS Modules"],
    demoUrl: "#",
    codeUrl: "#",
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
  },
  {
    title: "Project Title 3",
    description:
      "Showcasing a backend-focused project or API development work.",
    tags: ["Python", "Flask", "PostgreSQL"],
    codeUrl: "#", // No demoUrl for this one
    className: "md:col-span-2 lg:col-span-1", // Example of specific class for layout
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
  },
];

export default function Home() {
  const handleButtonMouseEnter = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    animate(
      {
        targets: event.currentTarget,
        scale: 1.05,
        translateY: -2,
        backgroundPosition: "0% 0",
        duration: 200,
        easing: "easeOutQuad",
      },
      {}
    );
  };

  const handleButtonMouseLeave = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    animate(
      {
        targets: event.currentTarget,
        scale: 1.0,
        translateY: 0,
        backgroundPosition: "100% 0",
        duration: 300,
        easing: "easeOutQuad",
      },
      {}
    );
  };

  const handleCardMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      animate(
        {
          targets: event.currentTarget,
          scale: 1.03,
          translateY: -4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          duration: 250,
          easing: "easeOutQuad",
        },
        {}
      );
    },
    []
  );

  const handleCardMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      animate(
        {
          targets: event.currentTarget,
          scale: 1.0,
          translateY: 0,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          duration: 350,
          easing: "easeOutQuad",
        },
        {}
      );
    },
    []
  );

  const handleCardClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      animate(
        {
          targets: event.currentTarget,
          scale: [1.03, 0.98, 1.03],
          translateY: [-4, 0, -4],
          duration: 200,
          easing: "easeInOutQuad",
        },
        {}
      );
    },
    []
  );

  const [appIsLoading, setAppIsLoading] = useState(true);
  const [showLoadingScreenComponent, setShowLoadingScreenComponent] =
    useState(true);
  const [pageContentVisible, setPageContentVisible] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setAppIsLoading(false);
    }, 2500);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleLoadingExitComplete = useCallback(() => {
    setShowLoadingScreenComponent(false);
    setPageContentVisible(true);
  }, []);

  useEffect(() => {
    if (pageContentVisible) {
      const initialDelay = 100;

      animate(
        {
          targets: "#about",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 600,
          easing: "easeOutExpo",
          delay: initialDelay,
        },
        {}
      );

      animate(
        {
          targets: "#work > h2",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 600,
          easing: "easeOutExpo",
          delay: initialDelay + 200,
        },
        {}
      );

      animate(
        {
          targets: "#work .grid > div",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          scale: [0.95, 1],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(150, { start: initialDelay + 350 }),
        },
        {}
      );

      animate(
        {
          targets: "#contact > h2",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 600,
          easing: "easeOutExpo",
          delay: initialDelay + 700,
        },
        {}
      );

      animate(
        {
          targets: "#contact > p, #contact > div",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(100, { start: initialDelay + 850 }),
        },
        {}
      );
    }
  }, [pageContentVisible]);

  return (
    <>
      {showLoadingScreenComponent && (
        <LoadingScreen
          isLoading={appIsLoading}
          onExitComplete={handleLoadingExitComplete}
        />
      )}

      <div
        className={`min-h-screen bg-white text-gray-900 flex flex-col font-mono relative transition-opacity duration-500 ease-in-out ${
          pageContentVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ visibility: pageContentVisible ? "visible" : "hidden" }}
      >
        <main className="flex-grow container mx-auto px-4 py-16 md:px-6 md:py-24 space-y-24 md:space-y-32 z-10 relative pl-20">
          {/* Hero/Intro Section */}
          <section
            id="about"
            className="flex flex-col items-start space-y-4 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              Vilém Barnet
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Full-Stack Engineer
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Passionate about crafting elegant and efficient digital
              experiences from end-to-end. I specialize in building robust
              backend systems and intuitive frontend interfaces, always focusing
              on user needs and delivering high-quality, scalable solutions. I
              thrive on tackling complex challenges and continuously learning
              new technologies.
            </p>
          </section>

          {/* Work/Projects Section */}
          <section id="work" className="space-y-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 md:mb-12 text-gray-900">
              Selected Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {projectsData.map((project, index) => (
                <ProjectCard
                  key={index} // Using index as key, consider a unique project.id if available
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  demoUrl={project.demoUrl}
                  codeUrl={project.codeUrl}
                  className={project.className} // Pass className if defined
                  onMouseEnter={handleCardMouseEnter}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Get In Touch
            </h2>
            <p className="text-gray-600 leading-relaxed">
              I&apos;m actively looking for new opportunities and collaborations
              where I can contribute to meaningful projects. Whether you have a
              specific project in mind, want to discuss potential roles, or just
              want to connect regarding web development, backend systems, or
              anything in between, I&apos;d love to hear from you.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The best way to reach me is via email. I strive to respond as soon
              as possible!
            </p>
            <div>
              <a
                href="mailto:your-email@example.com"
                className="inline-block text-white font-medium py-2.5 px-6 rounded-md text-sm md:text-base shadow-md hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(to right, #374151 50%, #1F2937 50%)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "100% 0",
                  color: "white",
                }}
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
              >
                Say Hello
              </a>
            </div>
            <div className="pt-6">
              <p className="text-sm text-gray-500 mb-3">
                You can also find me on:
              </p>
              <div className="flex space-x-6 text-gray-500">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="hover:text-sky-600 transition-colors duration-300"
                >
                  <span className="text-xs uppercase tracking-wider">
                    GitHub
                  </span>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="hover:text-sky-600 transition-colors duration-300"
                >
                  <span className="text-xs uppercase tracking-wider">
                    LinkedIn
                  </span>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                  className="hover:text-sky-600 transition-colors duration-300"
                >
                  <span className="text-xs uppercase tracking-wider">
                    Twitter
                  </span>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
