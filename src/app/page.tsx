"use client";

import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InputZone from "../components/InputZone";
import AgentStatusBar from "../components/AgentStatusBar";
import JsonPanel from "../components/JsonPanel";
import ArchitectPanel from "../components/ArchitectPanel";
import PitchPanel from "../components/PitchPanel";
import { mockSessions, ProjectSession, getSessionById } from "../utils/mockData";

export default function Home() {
  const [activeSession, setActiveSession] = useState<ProjectSession | null>(null);
  const [step, setStep] = useState<number>(0); // 0: empty/idle, 1: research, 2: architect, 3: pitch, 4: complete
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop toggle
  const [isExporting, setIsExporting] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState<"json" | "architect" | "pitch" | null>(null);

  // Simulation parameters (sequential agent steps with a delay)
  const STEP_DELAY = 2500;

  const handleLaunch = (url: string, fileName: string | null) => {
    // Determine which mock data to load
    // Default to the first session (copilot) if URL/file doesn't match others
    let selectedId = "copilot";
    if (url.includes("microgrid") || (fileName && fileName.toLowerCase().includes("grid"))) {
      selectedId = "energy";
    } else if (url.includes("compliance") || (fileName && fileName.toLowerCase().includes("compliance")) || (fileName && fileName.toLowerCase().includes("pdf"))) {
      selectedId = "docuquery";
    }

    const sessionData = getSessionById(selectedId);
    if (!sessionData) return;

    // Reset dashboard state for new simulation
    setActiveSession(sessionData);
    setStep(1); // Transition to Research Agent running
  };

  // Agent sequence simulator
  useEffect(() => {
    if (step === 0 || step === 4) return;

    const timer = setTimeout(() => {
      setStep((prevStep) => prevStep + 1);
    }, STEP_DELAY);

    return () => clearTimeout(timer);
  }, [step]);

  const handleNewSession = () => {
    setActiveSession(null);
    setStep(0);
    setExpandedPanel(null);
  };

  const handleSelectSession = (id: string) => {
    const session = getSessionById(id);
    if (session) {
      setActiveSession(session);
      setStep(4); // Preloaded history sessions are loaded in completed state
    }
  };

  // ZIP Exporter: JSON + Mermaid Code + Canvas 2x Rasterized PNG + Speech Script TXT
  const handleExportBundle = async () => {
    if (!activeSession || step < 4 || isExporting) return;
    setIsExporting(true);

    try {
      const zip = new JSZip();

      // 1. JSON Data
      zip.file(
        "extracted_intelligence.json",
        JSON.stringify(activeSession.research, null, 2)
      );

      // 2. Mermaid source code
      zip.file("system_architecture.mermaid", activeSession.architecture);

      // 3. Pitch Script TXT
      const scriptText = activeSession.pitch
        .map((slide) => {
          const header = `--- Slide ${slide.number} — ${slide.title} (${slide.duration}) ---`;
          const lines = slide.content
            .map((item) =>
              item.type === "stage"
                ? `[Stage Direction: ${item.text}]`
                : item.text
            )
            .join("\n\n");
          return `${header}\n${lines}`;
        })
        .join("\n\n");
      zip.file("pitch_script.txt", scriptText);

      // 4. Diagram PNG (rasterize from rendered SVG in DOM)
      const svgElement = document.querySelector("svg[id^='mermaid-render']");
      if (svgElement) {
        const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
        
        // Ensure styles carry over to image
        const style = document.createElement("style");
        style.textContent = `
          text { font-family: 'JetBrains Mono', monospace !important; }
          .node rect, .node circle, .node polygon, .node path { fill: #16213E !important; stroke: #00FF87 !important; }
          .edgePath .path { stroke: #00FF87 !important; }
        `;
        svgClone.appendChild(style);

        const svgString = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const blobURL = URL.createObjectURL(svgBlob);

        await new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement("canvas");
            const bbox = svgElement.getBoundingClientRect();
            const width = bbox.width || 800;
            const height = bbox.height || 600;
            const scale = 2; // 2x resolution

            canvas.width = width * scale;
            canvas.height = height * scale;

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.fillStyle = "#1A1A2E";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

              canvas.toBlob((pngBlob) => {
                if (pngBlob) {
                  zip.file("system_architecture_diagram.png", pngBlob);
                }
                URL.revokeObjectURL(blobURL);
                resolve();
              }, "image/png");
            } else {
              URL.revokeObjectURL(blobURL);
              resolve();
            }
          };
          image.onerror = () => {
            URL.revokeObjectURL(blobURL);
            resolve();
          };
          image.src = blobURL;
        });
      }

      // Generate and Download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${activeSession.id}_co_pilot_bundle.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("ZIP Generation Failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const getActivePanelData = () => {
    if (!activeSession) return { research: null, architecture: null, pitch: null };
    return {
      research: step >= 2 ? activeSession.research : null,
      architecture: step >= 3 ? activeSession.architecture : null,
      pitch: step >= 4 ? activeSession.pitch : null,
    };
  };

  const { research, architecture, pitch } = getActivePanelData();

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D] text-[#F0F0F0]">
      {/* Top Navbar */}
      <Navbar
        sessionTitle={activeSession ? activeSession.title : "Drop a problem. Ship a solution."}
        isExportReady={step === 4}
        onNewSession={handleNewSession}
        onExportBundle={handleExportBundle}
        isExporting={isExporting}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar Drawer */}
        <Sidebar
          activeSessionId={activeSession ? activeSession.id : null}
          onSelectSession={handleSelectSession}
          isSidebarOpen={isSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Main Workspace Area */}
        <main
          id="main-workspace-content"
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
            isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          {step === 0 ? (
            /* Empty State Layout */
            <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto text-center space-y-8 px-4">
              <div className="space-y-3.5">
                <div className="inline-flex items-center space-x-2 bg-[#00FF87]/10 border border-[#00FF87]/20 px-3.5 py-1.5 rounded-full text-[#00FF87] text-xs font-mono font-bold tracking-wider uppercase animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87]" />
                  <span>Ready for Hackathons</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  Drop a problem. <br />
                  <span className="bg-gradient-to-r from-[#00FF87] to-[#00D4FF] bg-clip-text text-transparent">
                    Ship a solution.
                  </span>
                </h2>
                <p className="text-sm md:text-base text-[#6B7280] font-sans max-w-xl mx-auto">
                  A high-velocity multi-agent concierge system. Launch our agents to crawl specs, layout architecture diagrams, and plan your stage script.
                </p>
              </div>

              {/* Centered Input Zone */}
              <div className="w-full">
                <InputZone onLaunch={handleLaunch} isRunning={false} />
              </div>

              {/* Minimalist Tech Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#2A2A2A]/40 w-full text-center">
                <div>
                  <p className="text-xl font-heading font-bold text-white">10s</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono mt-0.5">Pipeline Output</p>
                </div>
                <div>
                  <p className="text-xl font-heading font-bold text-white">3</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono mt-0.5">Specialist Agents</p>
                </div>
                <div>
                  <p className="text-xl font-heading font-bold text-white">ZIP</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono mt-0.5">One-click Bundler</p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Pipeline Workspace */
            <div className="space-y-5 max-w-7xl mx-auto">
              {/* Inputs & Status Pipeline (Visible in active workspace) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <InputZone onLaunch={handleLaunch} isRunning={step > 0 && step < 4} />
                </div>
                <div>
                  <AgentStatusBar currentStep={step} />
                </div>
              </div>

              {/* Output Panel Grid (Sequentially streamed/revealed panels) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Panel 1: Extracted JSON */}
                <div
                  className={`transition-opacity duration-500 ${
                    expandedPanel && expandedPanel !== "json" ? "hidden" : "block"
                  } ${step >= 1 ? "opacity-100" : "opacity-0"}`}
                >
                  <JsonPanel
                    data={research}
                    isLoading={step === 1}
                    isExpanded={expandedPanel === "json"}
                    onToggleExpand={() =>
                      setExpandedPanel(expandedPanel === "json" ? null : "json")
                    }
                  />
                </div>

                {/* Panel 2: Mermaid diagram */}
                <div
                  className={`transition-opacity duration-500 ${
                    expandedPanel && expandedPanel !== "architect" ? "hidden" : "block"
                  } ${step >= 1 ? "opacity-100" : "opacity-0"}`}
                >
                  <ArchitectPanel
                    code={architecture}
                    isLoading={step === 2}
                    isExpanded={expandedPanel === "architect"}
                    onToggleExpand={() =>
                      setExpandedPanel(expandedPanel === "architect" ? null : "architect")
                    }
                  />
                </div>

                {/* Panel 3: Pitch script */}
                <div
                  className={`transition-opacity duration-500 ${
                    expandedPanel && expandedPanel !== "pitch" ? "hidden" : "block"
                  } ${step >= 1 ? "opacity-100" : "opacity-0"}`}
                >
                  <PitchPanel
                    slides={pitch}
                    isLoading={step === 3}
                    isExpanded={expandedPanel === "pitch"}
                    onToggleExpand={() =>
                      setExpandedPanel(expandedPanel === "pitch" ? null : "pitch")
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
