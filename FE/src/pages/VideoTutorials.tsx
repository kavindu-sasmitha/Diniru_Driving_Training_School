import React, { useState, useEffect } from "react";
import api from "../service/api";
import Header from "../components/Header";

export default function VideoTutorials({ setAiPanelOpen }: { setAiPanelOpen: (open: boolean) => void }) {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.get(`/videos/get-all?page=${page}&limit=6`)
      .then((res) => {
        setVideos(res.data.data);
        setTotalPages(res.data.totalPage);
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, [page]);

  // Utility function to extract YouTube ID and convert it into an Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    
    // Regular expressions to match standard, share, and embed YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Fallback to original URL if it's already an embed link or not YouTube
    return url;
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-indigo-50/30">
      <Header 
        title="Video Tutorials" 
        description="Watch and learn your driving lessons" 
        setAiPanelOpen={setAiPanelOpen} 
      />
      
      {/* Responsive Container Padding */}
      <div className="p-4 sm:p-6 md:p-8 flex-1">
        
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((vid: any) => {
            const embedUrl = getYouTubeEmbedUrl(vid.videoUrl);
            
            return (
              <div 
                key={vid._id} 
                className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
              >
                {/* 🎥 Embedded YouTube Video Player instead of Static Thumbnail */}
                <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={vid.title}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
                      No Video URL Available
                    </div>
                  )}
                  
                  {/* Category Badge over the video player */}
                  <div className="absolute top-3 left-3 pointer-events-none z-10">
                    <span className="px-2.5 py-1 bg-slate-900/90 text-orange-400 text-[10px] font-extrabold tracking-wider uppercase rounded-lg border border-orange-500/30">
                      {vid.category}
                    </span>
                  </div>
                </div>

                {/* Text content area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-slate-800 font-extrabold text-sm line-clamp-1 mb-1.5 group-hover:text-orange-500 transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {vid.description}
                    </p>
                  </div>

                  {/* Optional: Keeps the external link option if they want to view on YouTube directly */}
                  <a 
                    href={vid.videoUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="mt-5 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wide border border-slate-200"
                  >
                    Open on YouTube ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mt-10 pb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 disabled:hover:bg-white hover:bg-slate-50 transition shadow-sm"
              >
                ← Previous
              </button>
              
              <span className="text-slate-400 text-xs font-bold sm:hidden">
                {page} / {totalPages}
              </span>

              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 disabled:hover:bg-white hover:bg-slate-50 transition shadow-sm"
              >
                Next →
              </button>
            </div>
            
            <span className="hidden sm:inline text-slate-400 text-xs font-bold">
              Page {page} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}