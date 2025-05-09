"use client";

import React from "react";
// import { animate } from "animejs"; // Removed unused import

export interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl: string;
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  // className can be added if specific layout classes (like md:col-span-2) need to be passed
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  demoUrl,
  codeUrl,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className = "", // Default to empty string
}) => {
  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col group cursor-pointer shadow-md ${className}`.trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-black transition-colors">
          {title}
        </h3>
        <div className="flex space-x-3 text-xs text-gray-500 mt-1 shrink-0">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-600 transition-colors"
              onClick={(e) => e.stopPropagation()} // Prevent card click animation on link click
            >
              Demo
            </a>
          )}
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 transition-colors"
            onClick={(e) => e.stopPropagation()} // Prevent card click animation on link click
          >
            Code
          </a>
        </div>
      </div>
      <p className="text-gray-600 mb-4 text-sm flex-grow">{description}</p>
      <div className="mt-auto pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
