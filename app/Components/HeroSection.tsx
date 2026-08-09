"use client"
import React from "react";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

export const HeroSection = () => {
  const companyLogos = [
    "Cloudplex",
    "TYTOTONE",
    "Bloopglow",
    "Zingzap",
    "Junotwig",
    "OctoFlow",
    "GitSync",
  ];

  return (
    <section className="pt-6 pb-16 px-4 sm:px-6 lg:px-[80px] mx-auto">
      {/* Hero Container with Warm Canyon Background Image */}
      <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-[#e2d5c1]">
        {/* Canyon Background Image */}
        <div className="absolute inset-0 z-0">
            <img
            src="bg-main.png"
            alt="Warm desert canyon landscape"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.55] contrast-[1.05]"
            />
          {/* Subtle overlay to enhance text visibility while keeping background visible */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/90 via-[#1c1815]/65 to-[#241f1a]/40" /> */}
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-6 py-20 sm:px-12 sm:py-28 lg:px-16 lg:py-32 text-center text-white flex flex-col items-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-100 shadow-inner mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Automated activity summaries</span>
          </div>

          {/* Main Display Headline with Parley Italic Accent Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-white drop-shadow-lg">
            Turn your GitHub activity into <br className="hidden sm:inline" />
            structured Standup reports.
          </h1>

          {/* Subtitle - Option 5 (Short & Punchy) */}
          <p className="mt-6 text-base sm:text-md text-stone-100/95 max-w-2xl leading-relaxed font-normal drop-shadow">
            Standup automatically summarizes your commits, PRs, and reviews into a clean daily report. Delivered to your inbox, on your schedule.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              className="
                group
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2.5
                rounded-md
                bg-[#f97316]
                p-6
                text-sm font-semibold text-white
                shadow-sm
                transition-all duration-200 ease-out
                hover:bg-[#f97316]
                hover:-translate-y-0.5
                hover:shadow-md
                active:translate-y-0
                active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#f97316]/50
                focus-visible:ring-offset-2
              "
            >
              <span>Get started free</span>

              <ArrowUpRight
                className="
                  h-4 w-4
                  transition-transform duration-200 ease-out
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Button>
          </div>

          {/* Feature Micro-Badges */}
          {/* <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-stone-100/90 font-medium">
            <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-[#f97316]" /> 2-Min GitHub OAuth
            </span>
            <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-[#f97316]" /> Customizable Cron Timezone
            </span>
            <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-[#f97316]" /> Email &amp; Slack Routing
            </span>
          </div> */}
        </div>
      </div>

      {/* Trusted By Logo Marquee Bar */}
      <div className="mt-12 text-center">
        <p className="text-xs uppercase tracking-widest font-semibold text-[#8c8273] mb-6">
          Trusted by 200+ fast-moving engineering teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
          {companyLogos.map((logo, idx) => (
            <span
              key={idx}
              className="text-lg sm:text-xl font-bold tracking-tight text-[#44403c] font-mono-code hover:text-[#f97316] transition-colors cursor-default"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};