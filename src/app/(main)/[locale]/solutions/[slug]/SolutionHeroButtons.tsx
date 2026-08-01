"use client";

import React from "react";

export default function SolutionHeroButtons({
  talkText = "Talk to our expert",
  howItWorksText = "See how it works",
}: {
  talkText?: string;
  howItWorksText?: string;
}) {
  const handleTalkClick = () => {
    window.dispatchEvent(new CustomEvent("open-contact-prompt"));
  };

  const handleHowItWorksClick = () => {
    const nextSection = document.getElementById("solution-next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={handleTalkClick}
        className="bg-[#00E573] text-black px-6 py-3 text-[13px] font-bold tracking-wide transition-all hover:bg-white hover:-translate-y-0.5 rounded-sm cursor-pointer"
      >
        {talkText}
      </button>
      <button
        type="button"
        onClick={handleHowItWorksClick}
        className="border border-white/20 text-white px-6 py-3 text-[13px] font-bold tracking-wide flex items-center gap-2 hover:bg-white/5 transition-all rounded-sm hover:-translate-y-0.5 cursor-pointer"
      >
        <span>{howItWorksText}</span>
        <span className="text-[14px] leading-none font-normal">→</span>
      </button>
    </div>
  );
}
