"use client";

import React, { useState } from "react";
import { PitchSlide } from "../utils/mockData";

interface PitchPanelProps {
  slides: PitchSlide[] | null;
  isLoading: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function PitchPanel({
  slides,
  isLoading,
  isExpanded,
  onToggleExpand,
}: PitchPanelProps) {
  const [openSlides, setOpenSlides] = useState<Record<number, boolean>>({ 1: true });
  const [copied, setCopied] = useState(false);

  const toggleSlide = (num: number) => {
    setOpenSlides((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const getFullScriptText = (includeStage = true) => {
    if (!slides) return "";
    return slides
      .map((slide) => {
        const slideHeader = `--- Slide ${slide.number} — ${slide.title} (${slide.duration}) ---`;
        const contentLines = slide.content
          .map((item) => {
            if (item.type === "stage") {
              return includeStage ? `[Stage Direction: ${item.text}]` : "";
            }
            return item.text;
          })
          .filter(Boolean)
          .join("\n\n");
        return `${slideHeader}\n${contentLines}`;
      })
      .join("\n\n");
  };

  const handleCopyScript = () => {
    const text = getFullScriptText(false); // Copy speech only for actual presentation usage
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = getFullScriptText(true); // Include stage directions for offline rehearsal
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pitch_rehearsal_script.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-lg border border-[#2A2A2A] bg-[#161616] flex flex-col transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50 bg-[#161616]" : "h-[450px]"
      }`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] px-4 py-3 bg-[#111111]">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
          <h2 className="font-heading text-sm font-bold tracking-wide uppercase text-[#F0F0F0]">
            Pitch Script
          </h2>
          <span className="text-[10px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 px-1.5 py-0.5 rounded font-mono">
            Pitch Agent
          </span>
        </div>

        {/* Panel Actions */}
        <div className="flex items-center space-x-2">
          {slides && !isLoading && (
            <>
              <button
                onClick={handleCopyScript}
                className="p-1 rounded hover:bg-[#2A2A2A] text-[#6B7280] hover:text-[#00FF87] transition-colors cursor-pointer text-[10px] font-mono border border-transparent hover:border-[#2A2A2A] flex items-center space-x-1"
                title="Copy Speech text only"
              >
                {copied ? (
                  <span className="text-[#00FF87]">Copied Speech!</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy Speech</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadTxt}
                className="p-1 rounded hover:bg-[#2A2A2A] text-[#6B7280] hover:text-[#00D4FF] transition-colors cursor-pointer text-[10px] font-mono border border-transparent hover:border-[#2A2A2A] flex items-center space-x-1"
                title="Download full rehearsal text with directions"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download .txt</span>
              </button>
            </>
          )}

          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#6B7280] hover:text-[#F0F0F0] transition-colors cursor-pointer"
            title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isExpanded ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0l5 0M4 4v5m11 0l5-5m0 0h-5m5 0v5m0 6l-5 5m0 0h5m-5 0v-5m-6 0l-5 5m0 0v-5m0 5h5" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-[#0F0F0F] text-[#F0F0F0]">
        {isLoading ? (
          <PitchSkeleton />
        ) : !slides || slides.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#6B7280] space-y-2">
            <svg className="w-8 h-8 text-[#2A2A2A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m.5 1.5L9 20" />
            </svg>
            <p className="font-sans text-xs">Awaiting pitch agent pipeline execution...</p>
          </div>
        ) : (
          <div className="space-y-2.5 font-sans">
            {slides.map((slide) => {
              const isOpen = !!openSlides[slide.number];
              return (
                <div
                  key={slide.number}
                  className="rounded-md border border-[#2A2A2A] bg-[#161616] overflow-hidden transition-all duration-200"
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => toggleSlide(slide.number)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#1E1E1E]/50 hover:bg-[#1E1E1E] transition-colors text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#FFD700]">
                        Slide {slide.number}
                      </span>
                      <span className="text-xs text-[#6B7280]">•</span>
                      <span className="text-sm font-heading font-bold text-[#F0F0F0] truncate">
                        {slide.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] font-mono text-[#6B7280] bg-[#0D0D0D] border border-[#2A2A2A] px-1.5 py-0.5 rounded">
                        {slide.duration}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-[#6B7280] transform transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="p-4 border-t border-[#2A2A2A] space-y-3.5 text-sm leading-relaxed bg-[#0D0D0D]/40">
                      {slide.content.map((item, idx) => (
                        <div key={idx}>
                          {item.type === "stage" ? (
                            <p className="text-xs text-[#FFD700] italic font-medium bg-[#FFD700]/5 border-l-2 border-[#FFD700] pl-3 py-1.5 my-1">
                              {item.text}
                            </p>
                          ) : (
                            <p className="text-sm text-[#E0E0E0] pl-1 font-sans">
                              {item.text}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* Skeleton loader for accordion cards */
function PitchSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded border border-[#2A2A2A] bg-[#161616] p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-3.5 bg-[#2A2A2A] rounded" />
            <div className="w-32 h-4 bg-[#2A2A2A] rounded" />
          </div>
          <div className="w-10 h-4 bg-[#2A2A2A] rounded" />
        </div>
      ))}
    </div>
  );
}
