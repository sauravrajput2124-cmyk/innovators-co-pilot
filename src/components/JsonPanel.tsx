"use client";

import React, { useState } from "react";

interface JsonPanelProps {
  data: Record<string, any> | null;
  isLoading: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function JsonPanel({
  data,
  isLoading,
  isExpanded,
  onToggleExpand,
}: JsonPanelProps) {
  const [copied, setCopied] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
          <h2 className="font-heading text-sm font-bold tracking-wide uppercase text-[#F0F0F0]">
            Extracted Intelligence
          </h2>
          <span className="text-[10px] bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 px-1.5 py-0.5 rounded font-mono">
            Research Agent
          </span>
        </div>

        {/* Panel Actions */}
        <div className="flex items-center space-x-2">
          {data && !isLoading && (
            <>
              <button
                onClick={() => setExpandAll(!expandAll)}
                className="p-1 rounded hover:bg-[#2A2A2A] text-[#6B7280] hover:text-[#F0F0F0] transition-colors cursor-pointer text-[10px] font-mono border border-transparent hover:border-[#2A2A2A]"
                title={expandAll ? "Collapse Nodes" : "Expand Nodes"}
              >
                {expandAll ? "Collapse All" : "Expand All"}
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#6B7280] hover:text-[#00D4FF] transition-colors cursor-pointer"
                title="Copy JSON to Clipboard"
              >
                {copied ? (
                  <span className="text-[10px] text-[#00FF87] font-mono font-bold">Copied!</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
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
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#0F0F0F] text-[#F0F0F0]">
        {isLoading ? (
          <JsonSkeleton />
        ) : !data ? (
          <div className="h-full flex flex-col items-center justify-center text-[#6B7280] space-y-2">
            <svg className="w-8 h-8 text-[#2A2A2A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
            <p className="font-sans">Awaiting research agent pipeline execution...</p>
          </div>
        ) : (
          <div className="scrollbar-thin">
            <JsonNode value={data} depth={0} isLast={true} expandAll={expandAll} />
          </div>
        )}
      </div>
    </div>
  );
}

/* Skeleton loader for VS-Code layout */
function JsonSkeleton() {
  return (
    <div className="space-y-3.5 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-[#2A2A2A] rounded" />
        <div className="w-24 h-4 bg-[#2A2A2A] rounded" />
      </div>
      <div className="pl-6 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-32 h-4 bg-[#2A2A2A] rounded" />
          <div className="w-48 h-4 bg-[#1E1E1E] rounded" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-20 h-4 bg-[#2A2A2A] rounded" />
          <div className="w-64 h-4 bg-[#1E1E1E] rounded" />
        </div>
        <div className="pl-6 space-y-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-40 h-4 bg-[#2A2A2A] rounded" />
            <div className="w-28 h-4 bg-[#1E1E1E] rounded" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-36 h-4 bg-[#2A2A2A] rounded" />
            <div className="w-52 h-4 bg-[#1E1E1E] rounded" />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-28 h-4 bg-[#2A2A2A] rounded" />
          <div className="w-32 h-4 bg-[#1E1E1E] rounded" />
        </div>
      </div>
      <div className="w-10 h-4 bg-[#2A2A2A] rounded" />
    </div>
  );
}

/* Interactive recursive JSON renderer */
interface JsonNodeProps {
  name?: string;
  value: any;
  depth: number;
  isLast: boolean;
  expandAll: boolean;
}

function JsonNode({ name, value, depth, isLast, expandAll }: JsonNodeProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Sync with expandAll toggle when it changes
  React.useEffect(() => {
    setCollapsed(!expandAll);
  }, [expandAll]);

  const indent = "  ".repeat(depth);

  // Handle object / array type
  if (value !== null && typeof value === "object") {
    const isArray = Array.isArray(value);
    const keys = Object.keys(value);
    const openBrack = isArray ? "[" : "{";
    const closeBrack = isArray ? "]" : "}";

    if (keys.length === 0) {
      return (
        <div>
          {indent}
          {name && <span className="text-[#00D4FF]">"{name}"</span>}
          {name && <span className="text-[#6B7280]">: </span>}
          <span className="text-white">
            {openBrack}
            {closeBrack}
          </span>
          {!isLast && <span className="text-[#6B7280]">,</span>}
        </div>
      );
    }

    return (
      <div className="group">
        <div className="flex items-center">
          <span>{indent}</span>
          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-4 h-4 -ml-4 flex items-center justify-center text-[#6B7280] hover:text-[#00D4FF] focus:outline-none transition-colors cursor-pointer select-none font-bold text-[8px]"
          >
            {collapsed ? "▶" : "▼"}
          </button>

          {name && <span className="text-[#00D4FF]">"{name}"</span>}
          {name && <span className="text-[#6B7280]">: </span>}
          <span className="text-white">{openBrack}</span>
          {collapsed && (
            <span
              onClick={() => setCollapsed(false)}
              className="text-[#6B7280] bg-[#1A1A1A] px-1 rounded hover:text-white cursor-pointer select-none mx-1 text-[10px]"
            >
              ...
            </span>
          )}
          {collapsed && <span className="text-white">{closeBrack}</span>}
          {collapsed && !isLast && <span className="text-[#6B7280]">,</span>}
        </div>

        {!collapsed && (
          <div>
            {keys.map((key, i) => (
              <JsonNode
                key={key}
                name={isArray ? undefined : key}
                value={value[key]}
                depth={depth + 1}
                isLast={i === keys.length - 1}
                expandAll={expandAll}
              />
            ))}
            <div>
              {indent}
              <span className="text-white">{closeBrack}</span>
              {!isLast && <span className="text-[#6B7280]">,</span>}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Primitive types
  let valueSpan = null;
  if (typeof value === "string") {
    valueSpan = <span className="text-white">"{value}"</span>;
  } else if (typeof value === "number") {
    valueSpan = <span className="text-[#00FF87]">{value}</span>;
  } else if (typeof value === "boolean") {
    valueSpan = <span className="text-[#FFD700]">{value.toString()}</span>;
  } else if (value === null) {
    valueSpan = <span className="text-gray-500">null</span>;
  }

  return (
    <div>
      {indent}
      {name && <span className="text-[#00D4FF]">"{name}"</span>}
      {name && <span className="text-[#6B7280]">: </span>}
      {valueSpan}
      {!isLast && <span className="text-[#6B7280]">,</span>}
    </div>
  );
}
