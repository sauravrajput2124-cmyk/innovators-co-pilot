"use client";

import React, { useState, useRef } from "react";

interface InputZoneProps {
  onLaunch: (url: string, fileContentName: string | null) => void;
  isRunning: boolean;
}

export default function InputZone({ onLaunch, isRunning }: InputZoneProps) {
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRunning) return;

    if (activeTab === "url") {
      // Default placeholder if empty (as mentioned in the plan)
      const urlToLaunch = urlInput.trim() || "https://github.com/proposals/decentralized-microgrid";
      onLaunch(urlToLaunch, null);
    } else {
      if (selectedFile) {
        onLaunch("", selectedFile.name);
      } else {
        // Fallback demo file if empty
        onLaunch("", "demo_project_specification.pdf");
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "txt") {
        setSelectedFile(file);
      } else {
        alert("Only PDF and TXT files are accepted.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "txt") {
        setSelectedFile(file);
      } else {
        alert("Only PDF and TXT files are accepted.");
      }
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full rounded-lg border border-[#2A2A2A] bg-[#161616] p-5 shadow-xl transition-all">
      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A] mb-5">
        <button
          onClick={() => !isRunning && setActiveTab("url")}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-widest font-sans border-b-2 transition-all cursor-pointer ${
            activeTab === "url"
              ? "border-[#00FF87] text-[#00FF87]"
              : "border-transparent text-[#6B7280] hover:text-[#F0F0F0]"
          } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Paste URL
        </button>
        <button
          onClick={() => !isRunning && setActiveTab("upload")}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-widest font-sans border-b-2 transition-all cursor-pointer ${
            activeTab === "upload"
              ? "border-[#00FF87] text-[#00FF87]"
              : "border-transparent text-[#6B7280] hover:text-[#F0F0F0]"
          } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Upload Document
        </button>
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "url" ? (
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isRunning}
                placeholder="https://github.com/org/repo or project proposal website..."
                className="w-full px-4 py-3 rounded border border-[#2A2A2A] bg-[#0D0D0D] text-[#F0F0F0] placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all disabled:opacity-60"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput("")}
                  className="absolute right-3 top-3.5 text-[#6B7280] hover:text-[#F0F0F0] text-xs font-mono"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isRunning}
              className="flex-shrink-0 px-6 py-3 rounded font-sans text-sm font-bold bg-[#00FF87] text-[#0D0D0D] border border-[#00FF87] hover:bg-[#00FF87]/90 hover:shadow-[0_0_15px_rgba(0,255,135,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:scale-100 cursor-pointer flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Launch Agents</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={!isRunning ? selectFiles : undefined}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-all text-center cursor-pointer ${
                dragActive
                  ? "border-[#00FF87] bg-[#00FF87]/5"
                  : "border-[#2A2A2A] bg-[#0D0D0D] hover:border-[#3E3E3E]"
              } ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                disabled={isRunning}
                className="hidden"
              />
              <svg
                className="w-10 h-10 text-[#6B7280] mb-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
              {selectedFile ? (
                <div className="flex items-center space-x-2 bg-[#161616] border border-[#2A2A2A] px-3.5 py-1.5 rounded text-xs font-mono">
                  <span className="text-[#00D4FF] truncate max-w-xs">{selectedFile.name}</span>
                  <span className="text-[#6B7280]">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  <button
                    onClick={clearFile}
                    className="text-[#6B7280] hover:text-[#00FF87] transition-colors ml-1 font-bold"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#F0F0F0] font-sans">
                    Drag and drop your file here, or <span className="text-[#00FF87] underline">browse</span>
                  </p>
                  <p className="text-[10px] text-[#6B7280] mt-1 font-mono">Supports PDF and TXT only</p>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isRunning}
                className="w-full md:w-auto px-6 py-3 rounded font-sans text-sm font-bold bg-[#00FF87] text-[#0D0D0D] border border-[#00FF87] hover:bg-[#00FF87]/90 hover:shadow-[0_0_15px_rgba(0,255,135,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:scale-100 cursor-pointer flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch Agents</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
