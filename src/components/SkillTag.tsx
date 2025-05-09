"use client";

import React from "react";

interface SkillTagProps {
  skillName: string;
  // Define a set of allowed color themes based on your categories
  categoryColorTheme: "sky" | "emerald" | "purple" | "amber" | "slate";
}

const SkillTag: React.FC<SkillTagProps> = ({
  skillName,
  categoryColorTheme,
}) => {
  // Define base and hover classes for each theme
  const themes = {
    sky: {
      base: "bg-sky-100 text-sky-800",
      hover: "hover:bg-sky-200",
    },
    emerald: {
      base: "bg-emerald-100 text-emerald-800",
      hover: "hover:bg-emerald-200",
    },
    purple: {
      base: "bg-purple-100 text-purple-800",
      hover: "hover:bg-purple-200",
    },
    amber: {
      base: "bg-amber-100 text-amber-800",
      hover: "hover:bg-amber-200",
    },
    slate: {
      base: "bg-slate-200 text-slate-800",
      hover: "hover:bg-slate-300",
    },
  };

  const currentTheme = themes[categoryColorTheme];

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors cursor-default ${currentTheme.base} ${currentTheme.hover}`}
    >
      {skillName}
    </span>
  );
};

export default SkillTag;
