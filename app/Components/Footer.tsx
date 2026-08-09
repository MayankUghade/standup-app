import React from "react";
import { FaTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa6";

interface FooterProps {
  onOpenSchedule?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSchedule }) => {
  return (
    <footer className="relative text-[#292524] pt-14 pb-12 px-6 sm:px-12 lg:px-16 overflow-hidden mt-12 shadow-[0_-1px_3px_0_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Top Header Row: Brand Title + Social Media */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <h3 className="text-3xl font-extrabold text-[#1c1917] tracking-tight">
            Standup
          </h3>

          <div className="flex items-center gap-3 text-xs text-[#78716c]">
            <span className="font-medium text-stone-500 mr-1">Social media</span>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-[#ded5c5] hover:bg-[#d4c9b7] flex items-center justify-center text-[#292524] transition-colors"
              aria-label="X"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-[#ded5c5] hover:bg-[#d4c9b7] flex items-center justify-center text-[#292524] transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-[#ded5c5] hover:bg-[#d4c9b7] flex items-center justify-center text-[#292524] transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Dotted Horizontal Line */}
        <div className="border-t border-dashed border-[#d5c9b4] w-full" />

        {/* Middle Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
          {/* Left Description Column */}
          <div className="md:col-span-5 max-w-md space-y-3">
            <p className="text-sm text-[#57534e] leading-relaxed">
              Your AI partner for email, calendar, research, and everything in between. Built for people who want to do their best work.
            </p>
          </div>

          {/* Right Columns: Workflows, Company, Legal */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Workflows Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-[#f97316] inline-block shrink-0" />
                <h4 className="font-semibold text-sm text-[#1c1917]">Workflows</h4>
              </div>
              <ul className="space-y-3 text-xs text-[#57534e]">
                <li><a href="#features" className="hover:text-[#f97316] transition-colors">Lead enrichment</a></li>
                <li><a href="#features" className="hover:text-[#f97316] transition-colors">Inbound triage</a></li>
                <li><a href="#features" className="hover:text-[#f97316] transition-colors">Ticket triage</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-[#f97316] inline-block shrink-0" />
                <h4 className="font-semibold text-sm text-[#1c1917]">Company</h4>
              </div>
              <ul className="space-y-3 text-xs text-[#57534e]">
                <li><a href="#faq" className="hover:text-[#f97316] transition-colors">Blog</a></li>
                <li><a href="#faq" className="hover:text-[#f97316] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-[#f97316] inline-block shrink-0" />
                <h4 className="font-semibold text-sm text-[#1c1917]">Legal</h4>
              </div>
              <ul className="space-y-3 text-xs text-[#57534e]">
                <li><a href="#faq" className="hover:text-[#f97316] transition-colors">404</a></li>
                <li><a href="#pricing" className="hover:text-[#f97316] transition-colors">Waitlist</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Watermark Section with Giant Text 'Standup' & Scattered Orange Squares */}
        <div className="relative pt-8 pb-4 flex justify-center items-center overflow-hidden select-none">
          <div className="text-[14vw] sm:text-[200px] lg:text-[260px] font-extrabold tracking-tighter text-[#ded5c4] leading-none text-center opacity-85 font-sans pointer-events-none">
            Standup
          </div>

          {/* Scattered Orange Squares over watermark as matching the screenshot
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-4 h-4 bg-[#f97316] absolute top-[28%] left-[30%] shadow-sm" />
            <div className="w-5 h-5 bg-[#f97316] absolute top-[18%] left-[42%] shadow-sm" />
            <div className="w-4 h-4 bg-[#f97316] absolute top-[22%] left-[46%] shadow-sm" />
            <div className="w-4 h-4 bg-[#f97316] absolute top-[62%] left-[38%] shadow-sm" />
            <div className="w-3.5 h-3.5 bg-[#f97316] absolute top-[30%] right-[42%] shadow-sm" />
            <div className="w-4 h-4 bg-[#f97316] absolute top-[58%] right-[35%] shadow-sm" />
            <div className="w-4 h-4 bg-[#f97316] absolute top-[40%] right-[28%] shadow-sm" />
            <div className="w-3.5 h-3.5 bg-[#f97316] absolute top-[20%] right-[22%] shadow-sm" />
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716c] gap-4">
          <p>© 2026 Standup. Developed By Mayank Ughade</p>

          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-[#1c1917] transition-colors">
              Terms&amp;Conditions
            </a>
          </div>
        </div>
      </div>

      {/* Floating CTA Button (Bottom-Right corner as seen in image) */}
    </footer>
  );
};