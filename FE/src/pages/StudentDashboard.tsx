import React, { useState, useEffect } from "react";
import api from "../service/api";
import { useAuth } from "../hooks/useAuth";
import diniruBook from "../assets/pdf/diniru-guide.pdf";
export default function StudentDashboard() {
  const { user } = useAuth();

  
  const [activeTab, setActiveTab] = useState<"videos" | "ai" | "exams" | "book">("videos");
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // AI Chat States
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  // Exam Papers States
  const [examPapers, setExamPapers] = useState([]);
  const [examPage, setExamPage] = useState(1);
  const [examTotalPages, setExamTotalPages] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean } | null>(null);

  // AI Panel open/close state
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

 
  const pdfUrl = diniruBook;

  useEffect(() => {
    if (activeTab === "videos") {
      api.get(`/videos/get-all?page=${page}&limit=6`)
        .then((res) => {
          setVideos(res.data.data);
          setTotalPages(res.data.totalPage);
        })
        .catch((err) => console.error("Error fetching videos:", err));
    }
  }, [activeTab, page]);

  useEffect(() => {
    if (activeTab === "exams" && !selectedPaper) {
      api.get(`/exams/papers?page=${examPage}&limit=6`)
        .then((res) => {
          setExamPapers(res.data.data);
          setExamTotalPages(res.data.totalPage);
        })
        .catch((err) => console.error("Error fetching exam papers:", err));
    }
  }, [activeTab, examPage, selectedPaper]);

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

  const handleStartExam = async (id: string) => {
    if (!user?.approved) {
      alert("Access Denied! Your account is pending admin approval to attempt exam papers. 🔐");
      return;
    }
    try {
      const res = await api.get(`/exams/papers/${id}`);
      setSelectedPaper(res.data.data);
      setSelectedAnswers({});
      setExamResult(null);
    } catch (err) {
      console.error("Error fetching single paper:", err);
    }
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitExam = async () => {
    if (!selectedPaper) return;
    if (Object.keys(selectedAnswers).length < selectedPaper.questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }
    try {
      const res = await api.post("/exams/submit", {
        examPaperId: selectedPaper._id,
        answers: selectedAnswers,
      });
      setExamResult({ score: res.data.score, passed: res.data.passed });
    } catch (err) {
      console.error("Error submitting exam:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  
  const navItems = [
    {
      key: "videos",
      label: "Video Tutorials",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
    },
    {
      key: "exams",
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
      key: "book",
      label: "Study Guide Book",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 font-sans antialiased overflow-hidden">

      {/* ── Sidebar ── */}
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
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key as any);
                if (item.key === "videos") setPage(1);
                if (item.key === "exams") { setExamPage(1); setSelectedPaper(null); setExamResult(null); }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <span className={activeTab === item.key ? "text-orange-400" : "text-zinc-500"}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* AI Teacher Button — triggers side panel */}
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

      {/* ── Main Content ── */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-white font-black text-lg tracking-tight">
                {activeTab === "videos" && "Video Tutorials"}
                {activeTab === "exams" && (selectedPaper ? selectedPaper.title : "Theory Exam Papers")}
                {/* 📝 Header Title */}
                {activeTab === "book" && "Diniru Driving School - Study Guide"}
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">
                {activeTab === "videos" && "Watch and learn your driving lessons"}
                {activeTab === "exams" && !selectedPaper && "Practice Sri Lankan road rules exam papers"}
                {activeTab === "exams" && selectedPaper && "Answer all questions carefully"}
                {/* 📝 Header Description */}
                {activeTab === "book" && "Read your theory book and highway code guidelines"}
              </p>
            </div>
            <button
              onClick={() => setAiPanelOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-400 text-xs font-bold rounded-xl transition-all"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Ask AI Teacher
            </button>
          </div>

          <div className="p-8">

            {/* ── Videos Tab ── */}
            {activeTab === "videos" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {videos.map((vid: any) => (
                    <div
                      key={vid._id}
                      className="group bg-zinc-900 border border-white/5 hover:border-orange-500/30 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="relative h-36 bg-zinc-800 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg width="18" height="18" fill="white" viewBox="0 0 24 24" className="translate-x-0.5">
                              <polygon points="5 3 19 12 5 21 5 3" fill="rgb(249 115 22)" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-zinc-900/80 text-orange-400 text-[10px] font-bold tracking-wider rounded-lg border border-orange-500/20">
                            {vid.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-white font-bold text-sm line-clamp-1 mb-1.5">{vid.title}</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 flex-1">{vid.description}</p>
                        <a
                          href={vid.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                        >
                          <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Watch Clip
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-5 py-2 bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl text-xs font-semibold disabled:opacity-40 hover:border-white/20 transition"
                    >
                      ← Previous
                    </button>
                    <span className="text-zinc-500 text-xs font-medium">Page {page} of {totalPages}</span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-5 py-2 bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl text-xs font-semibold disabled:opacity-40 hover:border-white/20 transition"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Exams Tab ── */}
            {activeTab === "exams" && (
              <div>
                {!selectedPaper ? (
                  <div>
                    {!user?.approved && (
                      <div className="mb-6 flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <svg width="18" height="18" fill="none" stroke="rgb(251 191 36)" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <span className="text-amber-400 text-xs font-semibold">Your account is pending admin approval. Exam access is restricted.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {examPapers.map((paper: any) => (
                        <div
                          key={paper._id}
                          className="group bg-zinc-900 border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                            <svg width="18" height="18" fill="none" stroke="rgb(249 115 22)" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                              <rect x="9" y="3" width="6" height="4" rx="1"/>
                              <path d="M9 12h6M9 16h4" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <h3 className="text-white font-bold text-sm mb-1.5">{paper.title || "Driving Theory Paper"}</h3>
                          <p className="text-zinc-500 text-xs leading-relaxed flex-1">Prepare yourself for the final exam by attending this model paper.</p>
                          <button
                            onClick={() => handleStartExam(paper._id)}
                            className="mt-5 w-full bg-orange-500 hover:bg-orange-400 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                          >
                            Start Exam →
                          </button>
                        </div>
                      ))}
                    </div>

                    {examTotalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-10">
                        <button disabled={examPage === 1} onClick={() => setExamPage(p => p - 1)} className="px-5 py-2 bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl text-xs font-semibold disabled:opacity-40 hover:border-white/20 transition">← Previous</button>
                        <span className="text-zinc-500 text-xs">Page {examPage} of {examTotalPages}</span>
                        <button disabled={examPage === examTotalPages} onClick={() => setExamPage(p => p + 1)} className="px-5 py-2 bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl text-xs font-semibold disabled:opacity-40 hover:border-white/20 transition">Next →</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
                      <div className="px-7 py-5 border-b border-white/5 flex items-center justify-between">
                        <div>
                          <h2 className="text-white font-black text-lg">{selectedPaper.title}</h2>
                          <p className="text-zinc-500 text-xs mt-0.5">{selectedPaper.questions?.length} Questions</p>
                        </div>
                        <button
                          onClick={() => setSelectedPaper(null)}
                          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs font-medium transition"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                          Close
                        </button>
                      </div>

                      <div className="p-7 space-y-7">
                        {selectedPaper.questions?.map((q: any, qIdx: number) => (
                          <div key={qIdx} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                            <p className="text-white text-sm font-semibold mb-4 leading-relaxed">
                              <span className="text-orange-500 font-black mr-2">{qIdx + 1}.</span>
                              {q.questionText}
                            </p>

                            {q.imageUrl && (
                              <div className="mb-4 max-w-[180px] bg-zinc-800 p-2 border border-white/5 rounded-xl shadow-md">
                                <img 
                                  src={q.imageUrl} 
                                  alt={`Question ${qIdx + 1} Sign`} 
                                  className="w-full h-auto object-contain rounded-lg"
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {q.options?.map((opt: string, oIdx: number) => (
                                <label
                                  key={oIdx}
                                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                                    selectedAnswers[qIdx] === oIdx
                                      ? "border-orange-500/50 bg-orange-500/10 text-white"
                                      : "border-white/5 bg-zinc-800/50 text-zinc-400 hover:border-white/15 hover:text-zinc-200"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${qIdx}`}
                                    checked={selectedAnswers[qIdx] === oIdx}
                                    onChange={() => handleOptionChange(qIdx, oIdx)}
                                    className="accent-orange-500 w-3.5 h-3.5"
                                  />
                                  <span className="text-xs font-medium">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="px-7 py-5 border-t border-white/5 flex justify-between items-center">
                        <span className="text-zinc-500 text-xs">
                          {Object.keys(selectedAnswers).length} / {selectedPaper.questions?.length} answered
                        </span>
                        <button
                          onClick={handleSubmitExam}
                          className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all"
                        >
                          Submit Answers
                        </button>
                      </div>
                    </div>

                    {/* Result Modal */}
                    {examResult && (
                      <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                          <div className="text-5xl mb-5">{examResult.passed ? "🎉" : "😥"}</div>
                          <h3 className="text-2xl font-black text-white">Exam Evaluated!</h3>
                          <p className="text-zinc-500 text-xs mt-1 mb-6">Your performance result</p>

                          <div className="mb-5 p-5 bg-zinc-800 rounded-2xl">
                            <div className="text-5xl font-black text-orange-400">{examResult.score}%</div>
                          </div>

                          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest ${examResult.passed ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-red-500/15 text-red-400 border border-red-500/25"}`}>
                            {examResult.passed ? "✓ PASSED" : "✕ FAILED"}
                          </span>

                          <button
                            onClick={() => { setSelectedPaper(null); setExamResult(null); }}
                            className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl text-xs transition"
                          >
                            Back to Exam Papers
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Study Guide Book Tab  */}
            {activeTab === "book" && (
              <div className="w-full h-[75vh]">
                <div className="w-full h-full bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-xl">
                  {/* PDF Viewer Top Controls */}
                  <div className="px-6 py-3 bg-zinc-900 border-b border-white/5 flex items-center justify-between shrink-0">
                    <span className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      Diniru Theory Book (PDF)
                    </span>
                    <a 
                      href={pdfUrl} 
                      download="Diniru_Driving_School_Study_Guide.pdf"
                      className="px-4 py-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-orange-500/10 flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download PDF
                    </a>
                  </div>

                  {/* Native Iframe Embedded PDF Viewer */}
                  <div className="flex-1 bg-zinc-950">
                    <iframe
                      src={`${pdfUrl}#toolbar=1`}
                      className="w-full h-full border-none"
                      title="Diniru Driving School Study Book"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── AI Teacher Side Panel ── */}
        <div className={`shrink-0 flex flex-col border-l border-white/5 bg-zinc-900 transition-all duration-300 ${aiPanelOpen ? "w-[380px]" : "w-0 overflow-hidden border-l-0"}`}>
          {aiPanelOpen && (
            <>
              {/* Panel Header */}
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                    <svg width="16" height="16" fill="none" stroke="rgb(249 115 22)" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z"/>
                      <path d="M8 10h8M8 14h5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">AI Teacher</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-emerald-400 text-[10px] font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAiPanelOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 transition"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatLog.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 border border-orange-500/20">
                      <svg width="22" height="22" fill="none" stroke="rgb(249 115 22)" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z"/>
                      </svg>
                    </div>
                    <p className="text-white font-bold text-sm">Diniru AI Teacher</p>
                    <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
                      Ask me about road rules, signs, or exam tips!
                    </p>
                    <div className="mt-4 flex flex-col gap-2 w-full">
                      {["What is a double yellow line?", "School zone speed limit?", "How to park safely?"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuestion(s)}
                          className="text-left px-3 py-2 rounded-xl border border-white/5 bg-zinc-800/50 text-zinc-400 text-xs hover:border-orange-500/20 hover:text-orange-400 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatLog.map((chat, idx) => (
                  <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {chat.sender === "bot" && (
                      <div className="w-6 h-6 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <svg width="12" height="12" fill="none" stroke="rgb(249 115 22)" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z"/>
                        </svg>
                      </div>
                    )}
                    <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      chat.sender === "user"
                        ? "bg-orange-500 text-white rounded-tr-sm"
                        : "bg-zinc-800 text-zinc-200 border border-white/5 rounded-tl-sm"
                    }`}>
                      {chat.text}
                    </div>
                  </div>
                ))}

                {loadingAi && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg width="12" height="12" fill="none" stroke="rgb(249 115 22)" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 2a10 10 0 00-7.35 16.83L3 21l2.17-1.65A10 10 0 1012 2z"/>
                      </svg>
                    </div>
                    <div className="px-3.5 py-2.5 bg-zinc-800 border border-white/5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleAskAi} className="p-4 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-2 bg-zinc-800 border border-white/5 rounded-xl px-3 py-2 focus-within:border-orange-500/30 transition">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a driving question…"
                    className="flex-1 bg-transparent text-white placeholder-zinc-600 text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 bg-orange-500 hover:bg-orange-400 rounded-lg flex items-center justify-center transition shrink-0"
                  >
                    <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
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