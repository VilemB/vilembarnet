import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-mono">
      <main className="flex-grow container mx-auto px-4 py-16 md:px-6 md:py-24 space-y-24 md:space-y-32">
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
            Passionate about crafting elegant and efficient digital experiences
            from end-to-end. I specialize in building robust backend systems and
            intuitive frontend interfaces, always focusing on user needs and
            delivering high-quality, scalable solutions. I thrive on tackling
            complex challenges and continuously learning new technologies.
          </p>
        </section>

        {/* Work/Projects Section */}
        <section id="work" className="space-y-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 md:mb-12 text-gray-900">
            Selected Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-black transition-colors">
                  Project Title 1
                </h3>
                <div className="flex space-x-3 text-xs text-gray-500 mt-1 shrink-0">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Demo
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Code
                  </a>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm flex-grow">
                Brief description of the project, highlighting key technologies
                or contributions. Made this one a bit longer to test the
                flex-grow property.
              </p>
              <div className="mt-auto pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1.5">
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    Next.js
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    Tailwind
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    TypeScript
                  </span>
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-black transition-colors">
                  Project Title 2
                </h3>
                <div className="flex space-x-3 text-xs text-gray-500 mt-1 shrink-0">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Demo
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Code
                  </a>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm flex-grow">
                Another project description, perhaps focusing on different
                skills or outcomes.
              </p>
              <div className="mt-auto pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1.5">
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    React
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    Node.js
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    CSS Modules
                  </span>
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col group md:col-span-2 lg:col-span-1">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-black transition-colors">
                  Project Title 3
                </h3>
                <div className="flex space-x-3 text-xs text-gray-500 mt-1 shrink-0">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Code
                  </a>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm flex-grow">
                Showcasing a backend-focused project or API development work.
              </p>
              <div className="mt-auto pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1.5">
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    Python
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    Flask
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    PostgreSQL
                  </span>
                </p>
              </div>
            </div>
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
              className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-300 text-sm md:text-base shadow-md hover:shadow-lg"
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
                <span className="text-xs uppercase tracking-wider">GitHub</span>
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
  );
}
