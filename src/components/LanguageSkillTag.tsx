"use client";

import React from "react";

interface LanguageSkillTagProps {
  name: string;
  proficiency: string;
}

const LanguageSkillTag: React.FC<LanguageSkillTagProps> = ({
  name,
  proficiency,
}) => {
  return (
    <span className="bg-rose-100 text-rose-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm cursor-default transition-colors hover:bg-rose-200">
      {name} ({proficiency})
    </span>
  );
};

export default LanguageSkillTag;
