"use client";

import React from "react";

interface NavbarProps {
  sessionTitle: string;
  isExportReady: boolean;
  onNewSession: () => void;
  onExportBundle: () => void;
  isExporting: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({
  sessionTitle,
  isExportReady,
  onNewSession,
  onExportBundle,
  isExporting,
  onToggleSidebar,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2A2A2A] bg-[#0D0D0D]/90 backdrop-blur-md px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section: Logo & Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            id="sidebar-toggle-btn"
            className="p-1.5 rounded bg-[#161616] border border-[#2A2A2A] text-[#F0F0F0] hover:text-[#00FF87] transition-colors md:hidden"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-[#00FF87]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              id="navbar-logo-icon"
            >
              <rect x="2" y="2" width="6" height="6" rx="1" className="fill-[#0D0D0D]" />
              <rect x="16" y="16" width="6" height="6" rx="1" className="fill-[#0D0D0D]" />
              <circle cx="19" cy="5" r="2.5" className="fill-[#00FF87]" />
              <circle cx="5" cy="19" r="2.5" className="fill-[#0D0D0D]" />
              <path d="M8 5h8.5M5 8v8M19 7.5v8.5M7.5 19H16" />
            </svg>
            <span className="font-heading text-lg font-bold tracking-tight text-[#F0F0F0]">
              Co-<span className="text-[#00FF87]">Pilot</span>
            </span>
          </div>
        </div>

        {/* Center Section: Session Title */}
        <div className="hidden sm:block text-center max-w-md truncate">
          <h1 className="font-heading text-sm uppercase tracking-widest text-[#6B7280]">
            The Innovator's Co-Pilot
          </h1>
          <p className="text-xs text-[#00D4FF] font-mono mt-0.5 truncate">
            {sessionTitle || "No Active Session"}
          </p>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center space-x-2.5">
          {isExportReady && (
            <button
              onClick={onExportBundle}
              id="export-bundle-btn"
              disabled={isExporting}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded font-sans text-xs font-semibold bg-[#00FF87] text-[#0D0D0D] border border-[#00FF87] hover:bg-[#00FF87]/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
                isExporting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Bundling...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export Bundle</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onNewSession}
            id="new-session-btn"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded font-sans text-xs font-semibold bg-[#161616] text-[#F0F0F0] border border-[#2A2A2A] hover:border-[#00FF87] hover:text-[#00FF87] transition-all cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Session</span>
          </button>
        </div>
      </div>
    </header>
  );
}
