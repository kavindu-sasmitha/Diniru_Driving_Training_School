import React from "react";

interface HeaderProps {
  title: string;
  description: string;
  setAiPanelOpen: (open: boolean) => void;
}

export default function Header({ title, description, setAiPanelOpen }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-white font-black text-lg tracking-tight">{title}</h1>
        <p className="text-zinc-500 text-xs mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setAiPanelOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-400 text-xs font-bold rounded-xl transition-all"
      >
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        Ask AI Teacher
      </button>
    </div>
  );
}