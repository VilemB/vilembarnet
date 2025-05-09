"use client";

import Footer from "@/components/Footer";
import { animate, stagger } from "animejs";
import React, { useState, useEffect, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";
import LanguageSkillTag from "@/components/LanguageSkillTag";
import SkillTag from "@/components/SkillTag";
import { Button } from "@/components/ui/button";
import { Mail, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

// Define project data array
const projectsData: ProjectCardProps[] = [
  {
    title: "eČtenářák",
    description:
      "A modern and user-friendly platform designed to help Czech students effectively manage their studies and prepare for literature final exams.",
    tags: ["Next.js", "TypeScript", "OpenAI API", "Tailwind", "MongoDB"],
    demoUrl: "https://www.ectenarak.cz",
    codeUrl: "https://github.com/vilemb/ectenarak",
    // Event handlers will be passed in the map function
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
  },
  {
    title: "GenCards",
    description:
      "A dynamic flashcard generation tool that empowers users to easily create, customize, and study digital card sets for efficient learning.",
    tags: ["Next.js", "TypeScript", "OpenAI API", "Tailwind", "MongoDB"],
    demoUrl: "https://gencards.vercel.app",
    codeUrl: "https://github.com/vilemb/gencards",
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
  },
  {
    title: "Sofia",
    description:
      "A community-driven platform for philosophical exploration, offering daily wisdom and fostering engaging discussions among thinkers and learners.",
    tags: ["Next.js", "JavaScript", "Tailwind", "MongoDB"],
    demoUrl: "https://www.sofia-app.com",
    codeUrl: "https://github.com/vilemb/sofiaapp",
    className: "md:col-span-2 lg:col-span-1", // Example of specific class for layout
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
  },
];

// Define language skills data structure
interface LanguageSkill {
  name: string;
  proficiency: string;
}

const languageSkillsData: LanguageSkill[] = [
  { name: "Czech", proficiency: "Native" },
  { name: "English", proficiency: "Fluent" },
  { name: "Spanish", proficiency: "Professional" },
  { name: "Greek", proficiency: "Basic" },
  { name: "Korean", proficiency: "Basic" },
];

const uiUxSkillsData: string[] = [
  "Figma",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
];

export default function Home() {
  const handleButtonMouseEnter = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    animate(
      {
        targets: event.currentTarget,
        scale: 1.06,
        translateY: -5,
        easing: "spring(1, 80, 10, 0)",
      },
      {}
    );
  };

  const handleButtonMouseLeave = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    animate(
      {
        targets: event.currentTarget,
        scale: 1.0,
        translateY: 0,
        duration: 300,
        easing: "easeOutQuad",
      },
      {}
    );
  };

  // Animation for social icons
  const handleIconMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    animate(
      {
        targets: event.currentTarget,
        scale: 1.2,
        translateY: -2,
        duration: 200,
        easing: "easeOutQuad",
      },
      {}
    );
  };

  const handleIconMouseLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    animate(
      {
        targets: event.currentTarget,
        scale: 1.0,
        translateY: 0,
        duration: 300,
        easing: "easeOutQuad",
      },
      {}
    );
  };

  // New state for tracking hovered card index
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const handleCardMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, index: number) => {
      setHoveredCardIndex(index); // Set hovered index
      // Original animation for scale/shadow - targets currentTarget
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
      setHoveredCardIndex(null); // Clear hovered index
      // Original animation for scale/shadow - targets currentTarget
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

      // 1. About Section (delay: initialDelay)
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

      // 2. Work Section Title (delay: initialDelay + 200)
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

      // 3. Project Cards (delay: stagger(150, { start: initialDelay + 350 }))
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

      // 4. Skills Section Title (delay: initialDelay + 600)
      animate(
        {
          targets: "#skills > h2",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 600,
          easing: "easeOutExpo",
          delay: initialDelay + 600,
        },
        {}
      );

      // 5. Skills Categories (6 categories total now)
      // Starts after Skills title, staggers through all category divs
      animate(
        {
          targets: "#skills .skill-category", // Using a common class for skill category divs
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          scale: [0.95, 1],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(150, { start: initialDelay + 750 }),
        },
        {}
      );

      // 6. Contact Section Title (Adjust delay based on 6 skill categories)
      // Last skill cat starts at initialDelay + 750 + 5*150 = initialDelay + 1500. Ends initialDelay + 2000
      animate(
        {
          targets: "#contact > h2",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 600,
          easing: "easeOutExpo",
          delay: initialDelay + 1600,
        },
        {}
      );

      // 7. Contact Section Content
      animate(
        {
          targets: "#contact > p, #contact > div",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(100, { start: initialDelay + 1750 }),
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
            className="flex flex-col items-start space-y-4 max-w-3xl mx-auto text-center sm:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 w-full">
              Vilém Barnet
            </h1>
            <p className="text-xl md:text-2xl text-sky-700 font-semibold w-full">
              Full-Stack Engineer & Digital Solutions Architect
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mt-1 w-full">
              Transforming complex challenges into elegant, user-centric web
              solutions that drive results.
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
                  key={index}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  demoUrl={project.demoUrl}
                  codeUrl={project.codeUrl}
                  className={project.className}
                  // Pass index to handlers and determine isHovering
                  onMouseEnter={(e) => handleCardMouseEnter(e, index)}
                  onMouseLeave={(e) => handleCardMouseLeave(e)} // No index needed for leave if currentTarget is used
                  onClick={(e) => handleCardClick(e)} // No index needed for click
                  isHovering={hoveredCardIndex === index}
                />
              ))}
            </div>
          </section>

          {/* Skills Section Updated */}
          <section id="skills" className="space-y-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Skills & Technologies
            </h2>
            <div className="space-y-8">
              {/* Frontend */}
              <div className="skill-category">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "JavaScript (ES6+)",
                    "HTML5",
                    "CSS3",
                    "Tailwind CSS",
                    "Anime.js",
                    "Three.js / R3F",
                  ].map((skill) => (
                    <SkillTag
                      key={skill}
                      skillName={skill}
                      categoryColorTheme="sky"
                    />
                  ))}
                </div>
              </div>
              {/* Backend */}
              <div className="skill-category">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Backend
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Node.js",
                    "Express.js",
                    "REST APIs",
                    "Python",
                    "Django",
                    "LLM integration",
                    "n8n",
                  ].map((skill) => (
                    <SkillTag
                      key={skill}
                      skillName={skill}
                      categoryColorTheme="emerald"
                    />
                  ))}
                </div>
              </div>
              {/* UI/UX Design */}
              <div className="skill-category">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  UI/UX Design
                </h3>
                <div className="flex flex-wrap gap-3">
                  {uiUxSkillsData.map((skill) => (
                    <SkillTag
                      key={skill}
                      skillName={skill}
                      categoryColorTheme="purple"
                    />
                  ))}
                </div>
              </div>
              {/* Databases */}
              <div className="skill-category">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Databases
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["MongoDB", "MySQL", "SQL"].map((skill) => (
                    <SkillTag
                      key={skill}
                      skillName={skill}
                      categoryColorTheme="amber"
                    />
                  ))}
                </div>
              </div>
              {/* Tools & Other */}
              <div className="skill-category">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Tools & Other
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Git & GitHub", "VS Code", "npm / yarn", "Vercel"].map(
                    (skill) => (
                      <SkillTag
                        key={skill}
                        skillName={skill}
                        categoryColorTheme="slate"
                      />
                    )
                  )}
                </div>
              </div>
              {/* Languages */}
              <div className="skill-category">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-4">
                  {languageSkillsData.map((skill) => (
                    <LanguageSkillTag
                      key={skill.name}
                      name={skill.name}
                      proficiency={skill.proficiency}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Get In Touch
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-xl mx-auto sm:mx-0">
              I&apos;m actively looking for new opportunities and collaborations
              where I can contribute to meaningful projects. Whether you have a
              specific project in mind, want to discuss potential roles, or just
              want to connect, I&apos;d love to hear from you.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                className="group bg-gray-800 hover:bg-sky-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
                asChild
              >
                <a
                  href="mailto:your-email@example.com"
                  className="flex items-center"
                >
                  <Mail className="mr-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-[360deg]" />
                  Let&apos;s Connect
                </a>
              </Button>
            </div>
            <div className="pt-8">
              <p className="text-base text-gray-600 mb-4">
                You can also find me on:
              </p>
              <div className="flex space-x-8 text-gray-600">
                <a
                  href="https://github.com/vilemb"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="hover:text-sky-700 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                  onMouseEnter={handleIconMouseEnter}
                  onMouseLeave={handleIconMouseLeave}
                >
                  <GithubIcon size={28} />
                </a>
                <a
                  href="https://www.linkedin.com/in/vil%C3%A9m-barnet-497003365/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="hover:text-sky-700 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                  onMouseEnter={handleIconMouseEnter}
                  onMouseLeave={handleIconMouseLeave}
                >
                  <LinkedinIcon size={28} />
                </a>
                <a
                  href="https://x.com/barnetvilem"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="X (Twitter)"
                  className="hover:text-sky-700 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                  onMouseEnter={handleIconMouseEnter}
                  onMouseLeave={handleIconMouseLeave}
                >
                  <TwitterIcon size={28} />
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
