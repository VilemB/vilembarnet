"use client";

import Footer from "@/components/Footer";
import { animate, stagger } from "animejs";
import React, { useState, useEffect, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";
import LanguageSkillTag from "@/components/LanguageSkillTag";
import SkillTag from "@/components/SkillTag";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Mail, GithubIcon, TwitterIcon } from "lucide-react";
import LazyCursor from "@/components/LazyCursor";

// Define project data array
const projectsData: ProjectCardProps[] = [
  {
    title: "eČtenářák",
    description:
      "A modern and user-friendly platform designed to help Czech students effectively manage their studies and prepare for literature final exams.",
    tags: ["Next.js", "TypeScript", "OpenAI API", "Tailwind", "MongoDB"],
    demoUrl: "https://www.ectenarak.cz",
    codeUrl: "https://github.com/vilemb/ectenarak",
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
    className: "md:col-span-2 lg:col-span-1",
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
  { name: "Spanish", proficiency: "Conversational" },
  { name: "Greek", proficiency: "Basic" },
  { name: "Korean", proficiency: "Basic" },
];

const uiUxSkillsData: string[] = [
  "Figma",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
];

// Define dummy blog article data
const articlesData = [
  {
    title: "AI Weekly: Major Announcements from the Past Week",
    snippet:
      "What just happened in AI? Here’s the short version.",
    date: "22/05/2025",
    mediumUrl:
      "https://medium.com/@barnetvilem/ai-weekly-major-announcements-from-the-past-week-c42bf07b0172",
  },
  {
    title: "Don't do what others want you to do, do what you love",
    snippet:
      "Why choosing passion over pressure is the smartest investment you'll ever make.",
    date: "16/05/2025",
    mediumUrl:
      "https://medium.com/@barnetvilem/dont-do-what-others-want-you-to-do-do-what-you-love-72652fc3f68b",
  },
];

export default function Home() {
  const [isLazyCursorHovering, setIsLazyCursorHovering] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [hoveredArticleIndex, setHoveredArticleIndex] = useState<number | null>(
    null
  );

  const handleButtonMouseEnter = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setIsLazyCursorHovering(true);
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
    setIsLazyCursorHovering(false);
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
    setIsLazyCursorHovering(true);
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
    setIsLazyCursorHovering(false);
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

  const handleCardMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, index: number) => {
      setHoveredCardIndex(index);
      setIsLazyCursorHovering(true);
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
      setHoveredCardIndex(null);
      setIsLazyCursorHovering(false);
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

  // New handlers for ArticleCard hover
  const handleArticleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, index: number) => {
      setHoveredArticleIndex(index);
      setIsLazyCursorHovering(true);
      animate(
        {
          targets: event.currentTarget,
          scale: 1.02,
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          duration: 200,
          easing: "easeOutQuad",
        },
        {}
      );
    },
    []
  );

  const handleArticleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setHoveredArticleIndex(null);
      setIsLazyCursorHovering(false);
      animate(
        {
          targets: event.currentTarget,
          scale: 1.0,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          duration: 300,
          easing: "easeOutQuad",
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setAppIsLoading(false);
    }, 2500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    setIsClient(true);
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

      // 5. Skills Categories (6 categories total)
      // Starts after Skills title, staggers through all category divs
      // Ends around initialDelay + 750 (start) + 5*150 (stagger for last) + 500 (duration) = initialDelay + 2000
      animate(
        {
          targets: "#skills .skill-category",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          scale: [0.95, 1],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(150, { start: initialDelay + 750 }),
        },
        {}
      );

      // 6. Blog Section Title (New - after skills categories finish)
      // Skills end around initialDelay + 2000. Start blog title initialDelay + 2100
      animate(
        {
          targets: "#blog > h2",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 600,
          easing: "easeOutExpo",
          delay: initialDelay + 2100,
        },
        {}
      );

      // 7. Blog Article Cards (New - after blog title starts)
      // Start blog cards initialDelay + 2100 + 150 = initialDelay + 2250
      // Ends around initialDelay + 2250 + (num_cards-1)*150 (stagger) + 500 (duration)
      // For 3 cards: initialDelay + 2250 + 2*150 + 500 = initialDelay + 3050
      animate(
        {
          targets: "#blog .grid > div",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          scale: [0.95, 1],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(150, { start: initialDelay + 2250 }),
        },
        {}
      );

      // 8. Contact Section Title (Adjusted delay)
      // Blog cards (3) end around initialDelay + 3050. Start contact title initialDelay + 3150
      animate(
        {
          targets: "#contact > h2",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 600,
          easing: "easeOutExpo",
          delay: initialDelay + 3150,
        },
        {}
      );

      // 9. Contact Section Content (Adjusted delay)
      // Start contact content initialDelay + 3150 + 150 = initialDelay + 3300
      animate(
        {
          targets: "#contact > p, #contact > div",
          opacity: [0, 1],
          translateY: ["20px", "0px"],
          duration: 500,
          easing: "easeOutExpo",
          delay: stagger(100, { start: initialDelay + 3300 }),
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
      {isClient && <LazyCursor isHovering={isLazyCursorHovering} />}

      <div
        className={`min-h-screen bg-white text-gray-900 flex flex-col font-mono relative transition-opacity duration-500 ease-in-out ${
          pageContentVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ visibility: pageContentVisible ? "visible" : "hidden" }}
      >
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-32 space-y-24 sm:space-y-32 md:space-y-40 z-10 relative">
          {/* Hero/Intro Section */}
          <section
            id="about"
            className="flex flex-col items-start space-y-3 sm:space-y-4 max-w-3xl mx-auto text-center sm:text-left pt-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-gray-900 w-full">
              Vilém Barnet
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-sky-700 font-semibold w-full">
              Full-Stack Engineer & Digital Solutions Architect
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mt-1 w-full">
              Transforming complex challenges into elegant, user-centric web
              solutions that drive results.
            </p>
          </section>

          {/* Work/Projects Section */}
          <section
            id="work"
            className="space-y-8 sm:space-y-12 max-w-3xl mx-auto pt-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6 sm:mb-10 md:mb-12 text-gray-900">
              Selected Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {projectsData.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  demoUrl={project.demoUrl}
                  codeUrl={project.codeUrl}
                  className={project.className}
                  onMouseEnter={(e) => handleCardMouseEnter(e, index)}
                  onMouseLeave={(e) => handleCardMouseLeave(e)}
                  onClick={(e) => handleCardClick(e)}
                  isHovering={hoveredCardIndex === index}
                />
              ))}
            </div>
          </section>

          {/* Skills Section Updated */}
          <section
            id="skills"
            className="space-y-8 sm:space-y-12 max-w-3xl mx-auto pt-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Skills & Technologies
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {/* Frontend */}
              <div className="skill-category">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "JavaScript (ES6+)",
                    "HTML5",
                    "CSS3",
                    "Tailwind CSS",
                    "Anime.js",
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Backend
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[
                    "Node.js",
                    "Express.js",
                    "REST APIs",
                    "LLM integration",
                    "Python",
                    "Django",
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  UI/UX Design
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Databases
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {["MongoDB", "Supabase", "MySQL" ].map((skill) => (
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Tools & Other
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {["Git & GitHub", "VS Code", "npm", "Vercel", "Linux"].map(
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-4">
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

          {/* Blog Section - New */}
          <section
            id="blog"
            className="space-y-8 sm:space-y-12 max-w-3xl mx-auto pt-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6 sm:mb-10 md:mb-12 text-gray-900">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {articlesData.map((article, index) => (
                <div key={index}>
                  <ArticleCard
                    title={article.title}
                    snippet={article.snippet}
                    date={article.date}
                    mediumUrl={article.mediumUrl}
                    onMouseEnter={(e) => handleArticleMouseEnter(e, index)}
                    onMouseLeave={(e) => handleArticleMouseLeave(e)}
                    isHovering={hoveredArticleIndex === index}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="space-y-8 sm:space-y-12 max-w-3xl mx-auto pt-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Get In Touch
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-xl mx-auto sm:mx-0">
              I&apos;m actively looking for new opportunities and collaborations
              where I can contribute to meaningful projects. Whether you have a
              specific project in mind, want to discuss potential roles, or just
              want to connect, I&apos;d love to hear from you.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                className="group bg-gray-800 hover:bg-sky-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full sm:w-auto"
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
                asChild
              >
                <a
                  href="mailto:your-email@example.com"
                  className="flex items-center justify-center sm:justify-start"
                >
                  <Mail className="mr-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-[360deg]" />
                  Let&apos;s Connect
                </a>
              </Button>
            </div>
            <div className="pt-6 sm:pt-8">
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                You can also find me on:
              </p>
              <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-8 text-gray-600">
                <a
                  href="https://github.com/vilemb"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="hover:text-sky-700 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                  onMouseEnter={handleIconMouseEnter}
                  onMouseLeave={handleIconMouseLeave}
                >
                  <GithubIcon size={24} className="sm:w-7 sm:h-7" />
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
                  <TwitterIcon size={24} className="sm:w-7 sm:h-7" />
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
