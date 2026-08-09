import React from "react";
import { GitCommit, Sparkles, Clock, ShieldCheck, Layers, Boxes } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export const WhyStandupSection: React.FC = () => {
  const cards = [
  {
    number: "01.",
    title: "Clusters, not chaos",
    description:
      "Groups related commits by repo and theme before summarizing — so scattered fixes and features become one clean, coherent line instead of forty disconnected ones.",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    number: "02.",
    title: "One-click sign-in",
    description:
      "Connect with GitHub in seconds. No API keys to paste, no webhooks to configure — just authorize and your daily digest starts the next morning.",
    icon: <FaGithub className="w-5 h-5" />,
  },
  {
    number: "03.",
    title: "Built for every repo you touch",
    description:
      "Works across your entire GitHub footprint at once, so a standup covering three side projects and a day job reads like one story, not three inboxes.",
    icon: <Boxes className="w-5 h-5" />,
  },
];

  return (
    <section className="px-[80px]">
      {/* Section Header */}
      <div className=" text-center mb-12 mt-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#ea580c] mb-4">
          Features
        </p>

        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1c1917]">
          Top features of Standup
        </h2>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="display flex items-center justify-center w-full gap-6">
        {cards.map((card) => (
          <div
            key={card.number}
            className="group relative bg-[#f2ebe0] hover:bg-[#eae0d2] p-8 rounded-2xl border border-[#e2d6c3] transition-all flex flex-col justify-between h-full overflow-hidden shadow-sm hover:shadow-md"
          >
            {/* Background dot matrix graphic */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-dot-matrix opacity-40 pointer-events-none" />

            <div>
              {/* Header row: Number + Icon */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-3xl font-mono-code font-bold text-[#1c1917]">
                  {card.number}
                </span>

                <div className="w-10 h-10 rounded-xl bg-[#e5dbc9] group-hover:bg-white flex items-center justify-center transition-colors shadow-inner">
                  {card.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-[#1c1917] mb-3 group-hover:text-[#ea580c] transition-colors">
                {card.title}
              </h3>

              <p className="text-sm text-[#57534e] leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Bottom subtle accent line */}
            <div className="mt-8 pt-4 border-t border-[#e0d3c0]/60 flex items-center justify-between text-xs text-[#8c8273]">
              <span>Automated Workflow</span>
              <span className="font-mono-code text-[#ea580c]">v2.4</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};