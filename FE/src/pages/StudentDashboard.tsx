import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../service/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = question;
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setQuestion("");
    setLoadingAi(true);

    try {
      const res = await api.post("/ai/ask-teacher", { question: userMsg });
      setChatLog((prev) => [...prev, { sender: "bot", text: res.data.botReply }]);
    } catch (err) {
      setChatLog((prev) => [...prev, { sender: "bot", text: "AI Teacher is currently offline. Please try again later." }]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  // Variables අලුතෙන් නොදා දැනට තියෙන URL එකෙන් Active Page එක හොයාගන්නා ක්‍රමය
  const currentPath = window.location.pathname;

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] font-sans antialiased text-slate-700 overflow-hidden relative">
      
      {/* ── 🌐 MOBILE RESPONSIVE PREMIUM NAVIGATION BAR ── */}
      <header className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-10 py-3 md:py-4 flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
        
        {/* Top Row on Mobile (Logo & Quick Actions) */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/dashboard")}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-base md:text-xl shadow-lg shadow-blue-500/20">
              D
            </div>
            <span className="text-slate-800 font-black text-lg md:text-xl tracking-tight uppercase">
              Diniru<span className="text-blue-600">.</span>
            </span>
          </div>

          {/* Quick AI & SignOut Toggle for Mobile layout header */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                aiPanelOpen ? "bg-orange-500 text-white border-transparent" : "bg-white text-orange-500 border-slate-200"
              }`}
            >
              Ask AI
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl text-xs font-bold text-red-500 bg-red-50">
              Exit
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Tabs on Mobile Screens */}
        <nav className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-300/40 w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth snap-x">
          <button 
            onClick={() => navigate("/dashboard/videos")} 
            className={`flex-1 md:flex-none text-center whitespace-nowrap snap-center px-4 md:px-6 py-2 rounded-lg text-[11px] md:text-xs font-extrabold tracking-wide uppercase transition-all duration-300 ${
              currentPath.includes("videos")
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15"
                : "text-slate-600 hover:text-blue-600 hover:bg-[#f8fafc]/80"
            }`}
          >
            Videos
          </button>
          
          <button 
            onClick={() => navigate("/dashboard/exams")} 
            className={`flex-1 md:flex-none text-center whitespace-nowrap snap-center px-4 md:px-6 py-2 rounded-lg text-[11px] md:text-xs font-extrabold tracking-wide uppercase transition-all duration-300 ${
              currentPath.includes("exams")
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15"
                : "text-slate-600 hover:text-blue-600 hover:bg-[#f8fafc]/80"
            }`}
          >
            Exams
          </button>
          
          <button 
            onClick={() => navigate("/dashboard/book")} 
            className={`flex-1 md:flex-none text-center whitespace-nowrap snap-center px-4 md:px-6 py-2 rounded-lg text-[11px] md:text-xs font-extrabold tracking-wide uppercase transition-all duration-300 ${
              currentPath.includes("book")
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15"
                : "text-slate-600 hover:text-blue-600 hover:bg-[#f8fafc]/80"
            }`}
          >
            Guide Book
          </button>
        </nav>

        {/* Right Side Actions for Tablets & Desktops */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 shadow-sm border ${
              aiPanelOpen 
                ? "bg-orange-500 text-white border-transparent shadow-md shadow-orange-500/10 scale-105" 
                : "bg-[#f8fafc] text-slate-700 border-slate-200 hover:border-orange-500/40 hover:bg-orange-50/40 hover:text-orange-600"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${aiPanelOpen ? "bg-white" : "bg-orange-500 animate-pulse"}`} />
            Ask AI Teacher
          </button>

          <button 
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── 📐 DYNAMIC MAIN WEBSITE CONTAINER ── */}
      <main className="flex-1 flex overflow-hidden relative bg-[#f1f5f9]">
        
        {/* Child Router Content Wrapper - Touch scrollable container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-indigo-50/30">
          <Outlet context={{ setAiPanelOpen }} />
        </div>

        {/* ── 🤖 MOBILE RESPONSIVE FLOATING AI PANEL ── */}
        <div 
          className={`fixed md:relative top-[115px] md:top-0 right-0 bottom-0 h-[calc(100vh-115px)] md:h-full flex flex-col bg-[#f8fafc] border-l border-slate-200/80 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out z-40 ${
            aiPanelOpen ? "w-full md:w-[400px] opacity-100" : "w-0 opacity-0 overflow-hidden border-l-0"
          }`}
        >
          {aiPanelOpen && (
            <>
              {/* AI Panel Header */}
              <div className="px-5 py-4 border-b border-slate-200/60 flex items-center justify-between shrink-0 bg-slate-100/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/15">
                    <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-800 font-black text-xs md:text-sm tracking-tight uppercase">AI Instructor</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-600 text-[9px] font-black tracking-widest uppercase">Live</span>
                    </div>
                  </div>
                </div>
                
                <button onClick={() => setAiPanelOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-400 hover:text-slate-600">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-100/20">
                {chatLog.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                      <svg width="24" height="24" fill="none" stroke="rgb(249 115 22)" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z"/>
                      </svg>
                    </div>
                    <p className="text-slate-800 font-extrabold text-sm md:text-base">Diniru AI Assistant</p>
                    <p className="text-slate-500 text-[11px] mt-1 max-w-[220px]">Ask any driving or rules question right now.</p>
                    
                    <div className="mt-4 flex flex-col gap-1.5 w-full max-w-[260px]">
                      {["What is a double yellow line?", "School zone speed limit?"].map((s) => (
                        <button key={s} onClick={() => setQuestion(s)} className="text-left px-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-600 text-[11px] font-bold hover:text-orange-600 transition shadow-sm">{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                {chatLog.map((chat, idx) => (
                  <div key={idx} className={`flex gap-2.5 ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {chat.sender === "bot" && (
                      <div className="w-7 h-7 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z"/>
                        </svg>
                      </div>
                    )}
                    <div className={`max-w-[85%] md:max-w-[78%] px-3.5 py-2 rounded-xl text-[11px] md:text-xs font-semibold leading-relaxed whitespace-pre-line shadow-sm border ${chat.sender === "user" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent rounded-tr-none" : "bg-[#f8fafc] text-slate-700 border-slate-200/60 rounded-tl-none"}`}>{chat.text}</div>
                  </div>
                ))}

                {loadingAi && (
                  <div className="flex items-center gap-2 justify-start">
                    <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center shrink-0"><span className="w-1 h-1 bg-slate-400 rounded-full animate-ping" /></div>
                    <div className="px-3 py-2 bg-[#f8fafc] border border-slate-200/60 rounded-xl rounded-tl-none flex items-center gap-1 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskAi} className="p-3 md:p-4 border-t border-slate-200/60 bg-[#f8fafc] shrink-0">
                <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 focus-within:bg-[#f8fafc] focus-within:ring-4 focus-within:ring-orange-500/5 transition duration-200">
                  <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question…" className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-[11px] md:text-xs font-bold focus:outline-none" />
                  <button type="submit" disabled={!question.trim() || loadingAi} className="w-7 h-7 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                    <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </main>
    </div>
  );
}