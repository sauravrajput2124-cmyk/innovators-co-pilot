"use client";

import React, { useState, useEffect, useRef } from "react";

interface ArchitectPanelProps {
  code: string | null;
  isLoading: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

declare global {
  interface Window {
    mermaid?: any;
  }
}

export default function ArchitectPanel({
  code,
  isLoading,
  isExpanded,
  onToggleExpand,
}: ArchitectPanelProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = "mermaid-svg-render-area";

  // Load Mermaid.js via CDN Script dynamically
  useEffect(() => {
    if (isLoading || !code) return;

    let isMounted = true;

    const initializeAndRender = async () => {
      try {
        if (!window.mermaid) {
          // If script is not yet added, add it
          const existingScript = document.getElementById("mermaid-cdn-script");
          if (!existingScript) {
            const script = document.createElement("script");
            script.id = "mermaid-cdn-script";
            script.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
            script.async = true;
            document.body.appendChild(script);

            await new Promise<void>((resolve, reject) => {
              script.onload = () => resolve();
              script.onerror = () => reject(new Error("Failed to load Mermaid CDN"));
            });
          } else {
            // Wait for it to be ready on window
            await new Promise<void>((resolve) => {
              const checkInterval = setInterval(() => {
                if (window.mermaid) {
                  clearInterval(checkInterval);
                  resolve();
                }
              }, 100);
            });
          }
        }

        if (!isMounted) return;

        // Initialize mermaid with specific configurations
        window.mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          themeVariables: {
            background: "#1A1A2E",
            primaryColor: "#16213E",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#00FF87",
            lineColor: "#00FF87",
            fontFamily: "JetBrains Mono",
            tertiaryColor: "#16213E",
          },
        });

        // Clear previous states
        setRenderError(null);

        // Generate clean unique ID for rendering
        const uniqueId = `mermaid-render-${Date.now()}`;
        const { svg } = await window.mermaid.render(uniqueId, code);

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setRenderError(err?.message || "Failed to render system architecture diagram.");
        }
      }
    };

    initializeAndRender();

    return () => {
      isMounted = false;
    };
  }, [code, isLoading]);

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPng = () => {
    if (!containerRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const svgElement = containerRef.current.querySelector("svg");
      if (!svgElement) {
        setIsExporting(false);
        return;
      }

      // Clone SVG to adjust sizes for export if necessary
      const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Inline stylesheet inside cloned SVG to ensure styles carry over
      const style = document.createElement("style");
      style.textContent = `
        text { font-family: 'JetBrains Mono', monospace !important; }
        .node rect, .node circle, .node polygon, .node path { fill: #16213E !important; stroke: #00FF87 !important; }
        .edgePath .path { stroke: #00FF87 !important; }
      `;
      svgClone.appendChild(style);

      const svgString = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        // Create canvas to draw onto at 2x scale
        const canvas = document.createElement("canvas");
        const bbox = svgElement.getBoundingClientRect();
        
        // Ensure default sizing if bounding client rect has zero size (e.g. hidden panel)
        const width = bbox.width || 800;
        const height = bbox.height || 600;
        const scale = 2; // 2x resolution

        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Background Fill (Deep Blue theme background)
          ctx.fillStyle = "#1A1A2E";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw image
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          // Trigger download
          const pngURL = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngURL;
          downloadLink.download = "system_architecture_2x.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobURL);
        setIsExporting(false);
      };

      image.onerror = (e) => {
        console.error("Image loading error:", e);
        URL.revokeObjectURL(blobURL);
        setIsExporting(false);
      };

      image.src = blobURL;
    } catch (error) {
      console.error("PNG Export Failed:", error);
      setIsExporting(false);
    }
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF87]" />
          <h2 className="font-heading text-sm font-bold tracking-wide uppercase text-[#F0F0F0]">
            System Architecture
          </h2>
          <span className="text-[10px] bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/20 px-1.5 py-0.5 rounded font-mono">
            Architect Agent
          </span>
        </div>

        {/* Panel Actions */}
        <div className="flex items-center space-x-2">
          {code && !isLoading && (
            <>
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="p-1 rounded hover:bg-[#2A2A2A] text-[#6B7280] hover:text-[#F0F0F0] transition-colors cursor-pointer text-[10px] font-mono border border-transparent hover:border-[#2A2A2A]"
                title="Toggle raw Mermaid code"
              >
                {showRaw ? "View Diagram" : "View Code"}
              </button>
              <button
                onClick={handleExportPng}
                disabled={isExporting}
                className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#6B7280] hover:text-[#00FF87] transition-colors cursor-pointer flex items-center space-x-1"
                title="Export as PNG (2x)"
              >
                {isExporting ? (
                  <span className="text-[10px] text-[#00FF87] font-mono">Saving...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-[10px] font-mono">PNG</span>
                  </>
                )}
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
      <div className="flex-1 overflow-auto p-4 flex flex-col bg-[#0F0F0F]">
        {isLoading ? (
          <ArchitectSkeleton />
        ) : !code ? (
          <div className="h-full flex flex-col items-center justify-center text-[#6B7280] space-y-2 flex-1">
            <svg className="w-8 h-8 text-[#2A2A2A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="font-sans text-xs">Awaiting architect agent pipeline execution...</p>
          </div>
        ) : renderError ? (
          <div className="h-full flex flex-col items-center justify-center text-red-400 space-y-2 flex-1">
            <svg className="w-8 h-8 text-red-500/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="font-sans text-xs font-semibold">Render Error</p>
            <p className="font-mono text-[10px] max-w-md text-center text-red-400/80 bg-red-950/20 border border-red-900/30 p-2 rounded">
              {renderError}
            </p>
            <button
              onClick={() => setShowRaw(true)}
              className="mt-2 text-xs text-[#00FF87] hover:underline"
            >
              Examine raw Mermaid code
            </button>
          </div>
        ) : showRaw ? (
          /* Raw code view */
          <div className="relative flex-1 flex flex-col font-mono text-xs text-[#F0F0F0]">
            <div className="absolute right-2 top-2 z-10 flex space-x-1">
              <button
                onClick={handleCopyCode}
                className="p-1 px-2 rounded bg-[#161616] border border-[#2A2A2A] text-xs text-[#6B7280] hover:text-[#00FF87] hover:border-[#00FF87]/30 transition-all cursor-pointer font-sans"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="flex-1 p-4 rounded bg-[#0D0D0D] border border-[#2A2A2A] overflow-auto select-all text-[#00D4FF]">
              <code>{code}</code>
            </pre>
          </div>
        ) : (
          /* Mermaid inline rendering */
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] w-full relative">
            <div
              ref={containerRef}
              className="w-full flex items-center justify-center p-4 bg-[#1A1A2E] border border-[#2A2A2A]/40 rounded-lg overflow-auto max-h-[360px]"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            <p className="text-[10px] text-[#6B7280] mt-2 font-mono">
              Designed at #1A1A2E background with #00FF87 accents
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* Skeleton loader for architect drawing */
function ArchitectSkeleton() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4 animate-pulse flex-1">
      <div className="w-[300px] h-[120px] rounded border border-[#2A2A2A] bg-[#161616] flex items-center justify-center">
        <div className="w-3/4 h-4 bg-[#2A2A2A] rounded" />
      </div>
      
      {/* Down arrow representation */}
      <svg className="w-5 h-5 text-[#2A2A2A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
      </svg>
      
      <div className="flex space-x-6">
        <div className="w-[140px] h-[90px] rounded border border-[#2A2A2A] bg-[#161616] flex items-center justify-center">
          <div className="w-2/3 h-4 bg-[#2A2A2A] rounded" />
        </div>
        <div className="w-[140px] h-[90px] rounded border border-[#2A2A2A] bg-[#161616] flex items-center justify-center">
          <div className="w-2/3 h-4 bg-[#2A2A2A] rounded" />
        </div>
      </div>
    </div>
  );
}
