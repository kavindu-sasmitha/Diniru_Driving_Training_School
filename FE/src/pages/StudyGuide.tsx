import React from "react";
import diniruBook from "../assets/pdf/diniru-guide.pdf";
import Header from "../components/Header";

export default function StudyGuide({ setAiPanelOpen }: { setAiPanelOpen: (open: boolean) => void }) {
  const pdfUrl = diniruBook;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-indigo-50/30">
      <Header 
        title="Diniru Driving School - Study Guide" 
        description="Read your theory book and highway code guidelines" 
        setAiPanelOpen={setAiPanelOpen} 
      />
      
      {/* Responsive Wrapper Spacing */}
      <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
        <div className="w-full h-auto md:h-[75vh] bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          
          {/* Section Header - Flexible Layout for Small Screens */}
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <span className="text-slate-700 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Diniru Theory Book (PDF)
            </span>
            <a 
              href={pdfUrl} 
              download="Diniru_Driving_School_Study_Guide.pdf"
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white text-xs font-extrabold rounded-xl transition shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </a>
          </div>

          {/* Core Content Area - Smart Device Switch */}
          <div className="flex-1 bg-slate-100/50 min-h-[350px] md:min-h-0 flex flex-col">
            
            {/* 📱 Mobile UI View: Hidden on Desktop, Shown on Mobile */}
            <div className="block md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-4 text-orange-500 shadow-sm">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-slate-800 font-extrabold text-sm mb-1">Read on your Mobile Device</h4>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-6">
                Mobile browsers restrict embedded PDF viewing. Tap below to download or view full-screen safely.
              </p>
              <a 
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-xl shadow-sm transition"
              >
                Open Full Book ↗
              </a>
            </div>

            {/* 💻 Desktop UI View: Hidden on Mobile, Embedded Frame on Desktop */}
            <div className="hidden md:block flex-1 h-full">
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                className="w-full h-full border-none"
                title="Diniru Driving School Study Book"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}