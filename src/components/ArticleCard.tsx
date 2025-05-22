"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export interface ArticleCardProps {
  title: string;
  snippet: string;
  date: string;
  mediumUrl: string;
  className?: string;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isHovering?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  snippet,
  date,
  mediumUrl,
  className = "",
  onMouseEnter,
  onMouseLeave,
  isHovering,
}) => {
  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col group cursor-pointer shadow-md ${className} transition-all duration-300 ease-in-out hover:shadow-lg h-full ${
        isHovering ? "border-sky-300" : "border-gray-200"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => window.open(mediumUrl, "_blank", "noopener,noreferrer")}
      role="article"
      aria-labelledby={`article-title-${title
        .replace(/\s+/g, "-")
        .toLowerCase()}`}
    >
      <div className="flex-grow mb-4">
        <h3
          id={`article-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-sky-700 transition-colors duration-300 mb-2"
        >
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{snippet}</p>
      </div>

      <div className="mt-auto pt-3 border-t border-gray-200 text-right flex justify-between">
        <p className="text-gray-600 text-sm">{date}</p>
        <a
          href={mediumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center py-1 px-3 rounded text-sm text-gray-600 hover:bg-gray-100 hover:text-sky-700 transition-colors duration-150 group/button ${
            isHovering ? "bg-sky-50 text-sky-600 ring-1 ring-sky-200" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          Read on Medium
          <ArrowRight
            className={`ml-1.5 h-4 w-4 transition-transform duration-200 ease-in-out group-hover/button:translate-x-1 ${
              isHovering
                ? "text-sky-600"
                : "text-gray-600 group-hover/button:text-sky-700"
            }`}
          />
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
