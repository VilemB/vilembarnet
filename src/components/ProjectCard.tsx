"use client";

import React from "react"; // Cleaned up imports

export interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl?: string;
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  isHovering?: boolean; // New prop for hover state
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description, // This is the full description, no truncation logic here anymore
  tags,
  demoUrl,
  codeUrl,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className = "",
  isHovering = false, // Default to false
}) => {
  return (
    <div
      className={`bg-gray-50 border rounded-lg p-5 flex flex-col group cursor-pointer shadow-md ${className} transition-all duration-300 ease-in-out ${
        isHovering ? "border-sky-300" : "border-gray-200"
      }`.trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      // Example: Apply a subtle dim effect to the whole card, letting specific elements become more prominent
      // style={{ filter: isHovering ? 'brightness(0.95)' : 'brightness(1)' }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3
          className={`text-lg md:text-xl font-semibold text-gray-800 group-hover:text-black transition-colors duration-300 ${
            isHovering ? "opacity-90" : "opacity-100"
          }`}
        >
          {title}
        </h3>
        {/* Action links area - will be styled based on hover */}
        <div
          className={`flex space-x-1 text-xs text-gray-500 mt-1 shrink-0 transition-all duration-300 ease-in-out ${
            isHovering ? "opacity-100 scale-110" : "opacity-75 scale-100"
          }`}
        >
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`py-1 px-2 rounded hover:bg-sky-100 hover:text-sky-700 transition-colors duration-150 ${
                isHovering ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              Demo
            </a>
          )}
          {codeUrl && (
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`py-1 px-2 rounded hover:bg-sky-100 hover:text-sky-700 transition-colors duration-150 ${
              isHovering ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            >
              Code
            </a>
          )}
        </div>
      </div>

      <p
        className={`text-gray-600 mb-4 text-sm flex-grow transition-opacity duration-300 ${
          isHovering ? "opacity-60" : "opacity-100"
        }`}
      >
        {description}
      </p>

      <div className="mt-auto pt-3 border-t border-gray-200">
        <div
          className={`flex flex-wrap gap-x-2 gap-y-1.5 transition-opacity duration-300 ${
            isHovering ? "opacity-60" : "opacity-100"
          }`}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
