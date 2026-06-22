"use client";

import React from "react";

interface AgentStatusBarProps {
  currentStep: number; // 0 = idle/empty, 1 = Research active, 2 = Architect active, 3 = Pitch active, 4 = all complete
}

export default function AgentStatusBar({ currentStep }: AgentStatusBarProps) {
  const steps = [
    {
      id: 1,
      name: "Research Agent",
      role: "Extracted Intelligence",
      color: "#00D4FF", // blue for research
    },
    {
      id: 2,
      name: "Architect Agent",
      role: "System Architecture",
      color: "#00FF87", // green for architect
    },
    {
      id: 3,
      name: "Pitch Agent",
      role: "Pitch Script",
      color: "#FFD700", // gold for pitch
    },
  ];

  return (
    <div className="w-full rounded-lg border border-[#2A2A2A] bg-[#161616] p-4 shadow-md transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
        {steps.map((step, idx) => {
          const isComplete = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isIdle = currentStep < step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Card */}
              <div
                className={`flex-1 w-full flex items-center p-3 rounded-md border transition-all ${
                  isActive
                    ? "bg-[#161616] border-[#00FF87] shadow-[0_0_10px_rgba(0,255,135,0.15)] animate-pulse"
                    : isComplete
                    ? "bg-[#0D0D0D] border-[#2A2A2A]"
                    : "bg-[#0D0D0D]/40 border-[#2A2A2A]/50 opacity-50"
                }`}
              >
                {/* Status Indicator Circle */}
                <div className="flex-shrink-0 mr-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isComplete
                        ? "bg-[#00FF87] text-[#0D0D0D]"
                        : isActive
                        ? "bg-[#00FF87]/20 border border-[#00FF87] text-[#00FF87]"
                        : "bg-[#161616] border border-[#2A2A2A] text-[#6B7280]"
                    }`}
                  >
                    {isComplete ? (
                      <svg
                        className="w-4.5 h-4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isActive ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00FF87]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                </div>

                {/* Step labels */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-heading font-bold tracking-wide truncate ${
                      isActive ? "text-[#00FF87]" : isComplete ? "text-[#F0F0F0]" : "text-[#6B7280]"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-[10px] text-[#6B7280] font-mono truncate">{step.role}</p>
                </div>

                {/* Pulsing indicator on right if active */}
                {isActive && (
                  <div className="flex-shrink-0 flex items-center space-x-1 ml-2">
                    <span className="text-[10px] text-[#00FF87] font-mono font-bold tracking-wider uppercase animate-pulse">
                      Analyzing
                    </span>
                  </div>
                )}
              </div>

              {/* Connecting Arrow (hidden on mobile, last item) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-2 flex-shrink-0">
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      currentStep > step.id ? "text-[#00FF87]" : "text-[#2A2A2A]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
