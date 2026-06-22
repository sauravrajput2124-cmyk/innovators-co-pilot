"use client";

import React from "react";
import { mockSessions } from "../utils/mockData";

interface SidebarProps {
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  isSidebarOpen: boolean; // Mobile visible drawer
  isSidebarCollapsed: boolean; // Desktop narrow mode
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  activeSessionId,
  onSelectSession,
  isSidebarOpen,
  isSidebarCollapsed,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay Background */}
      {isSidebarOpen && (
        <div
          onClick={onCloseMobile}
          id="sidebar-overlay"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="dashboard-sidebar"
        className={`fixed top-[57px] bottom-0 left-0 z-30 flex flex-col border-r border-[#2A2A2A] bg-[#161616] transition-all duration-300 ${
          isSidebarOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0"
        } ${
          isSidebarCollapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        {/* Header inside sidebar (Desktop Toggle) */}
        <div className="hidden md:flex items-center justify-between p-3.5 border-b border-[#2A2A2A]">
          {!isSidebarCollapsed && (
            <span className="text-xs uppercase tracking-widest text-[#6B7280] font-mono">
              Session Logs
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            id="desktop-sidebar-toggle"
            className={`p-1 rounded bg-[#0D0D0D] border border-[#2A2A2A] text-[#6B7280] hover:text-[#00FF87] transition-colors cursor-pointer ${
              isSidebarCollapsed ? "mx-auto" : ""
            }`}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg
              className={`w-4 h-4 transform transition-transform duration-300 ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {mockSessions.map((session) => {
            const isActive = activeSessionId === session.id;
            return (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center rounded-md p-2.5 transition-all text-left group cursor-pointer ${
                  isActive
                    ? "bg-[#0D0D0D] border border-[#00FF87]/30 text-[#00FF87]"
                    : "border border-transparent text-[#6B7280] hover:bg-[#0D0D0D] hover:text-[#F0F0F0]"
                }`}
                title={session.title}
              >
                {/* Icon (always visible) */}
                <div className="flex-shrink-0">
                  <svg
                    className={`w-4.5 h-4.5 transition-colors ${
                      isActive ? "text-[#00FF87]" : "text-[#6B7280] group-hover:text-[#F0F0F0]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Details (hidden when desktop collapsed) */}
                {(!isSidebarCollapsed || isSidebarOpen) && (
                  <div className="ml-3 overflow-hidden">
                    <p className="text-xs font-medium truncate font-sans">{session.title}</p>
                    <p className="text-[10px] text-[#6B7280] font-mono mt-0.5 truncate">{session.created}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer inside sidebar */}
        <div className="p-3 border-t border-[#2A2A2A] bg-[#0D0D0D]/40">
          {(!isSidebarCollapsed || isSidebarOpen) ? (
            <div className="flex items-center space-x-2 text-[10px] text-[#6B7280] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-ping" />
              <span>V1.0.0 Online</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-ping" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
