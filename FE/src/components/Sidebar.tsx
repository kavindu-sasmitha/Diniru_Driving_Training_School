import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  setAiPanelOpen: (open: boolean) => void;
  handleLogout: () => void;
}

export default function Sidebar({ setAiPanelOpen, handleLogout }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard/videos",
      label: "Video Tutorials",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
    },
    {
      path: "/dashboard/exams",
      label: "Exam Papers",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      ),
    },
    {
      path: "/dashboard/book",
      label: "Study Guide Book",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-zinc-900 border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-black text-base tracking-tighter leading-none">
              DINIRU<span className="text-orange-500">.</span>
            </div>
            <div className="text-zinc-500 text-[10px] font-medium tracking-wider">STUDENT PORTAL</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 bg-zinc-800/50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || "S"}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.name || "Student"}</div>
            <div className={`text-[10px] font-medium ${user?.approved ? "text-emerald-400" : "text-amber-400"}`}>
              {user?.approved ? "● Approved" : "● Pending"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="text-zinc-600 text-[9px] font-black tracking-[2px] uppercase px-3 mb-3">Navigation</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-orange-400" : "text-zinc-500"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* AI Teacher Button */}
        <button
          onClick={() => setAiPanelOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 mt-1"
        >
          <span className="text-zinc-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z" />
              <path d="M8 10h8M8 14h5" strokeLinecap="round" />
            </svg>
          </span>
          AI Teacher
          <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        </button>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}