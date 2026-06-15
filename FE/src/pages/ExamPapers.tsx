import React, { useState, useEffect } from "react";
import api from "../service/api";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";

export default function ExamPapers({ setAiPanelOpen }: { setAiPanelOpen: (open: boolean) => void }) {
  const { user } = useAuth();
  const [examPapers, setExamPapers] = useState([]);
  const [examPage, setExamPage] = useState(1);
  const [examTotalPages, setExamTotalPages] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean } | null>(null);

  useEffect(() => {
    if (!selectedPaper) {
      api.get(`/exams/papers?page=${examPage}&limit=6`)
        .then((res) => {
          setExamPapers(res.data.data);
          setExamTotalPages(res.data.totalPage);
        })
        .catch((err) => console.error("Error fetching exam papers:", err));
    }
  }, [examPage, selectedPaper]);

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

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-indigo-50/30">
      <Header 
        title={selectedPaper ? selectedPaper.title : "Theory Exam Papers"} 
        description={selectedPaper ? "Answer all questions carefully" : "Practice Sri Lankan road rules exam papers"} 
        setAiPanelOpen={setAiPanelOpen} 
      />
      
      {/* Responsive Wrapper Padding */}
      <div className="p-4 sm:p-6 md:p-8">
        {!selectedPaper ? (
          <div>
            {!user?.approved && (
              <div className="mb-6 flex items-start sm:items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <svg className="shrink-0 mt-0.5 sm:mt-0" width="18" height="18" fill="none" stroke="rgb(245 158 11)" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="text-amber-700 text-xs font-bold leading-normal">Your account is pending admin approval. Exam access is restricted.</span>
              </div>
            )}

            {/* Grid adjustments for Mobile (1 col), Tablet (2 cols), Desktop (3 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {examPapers.map((paper: any) => (
                <div key={paper._id} className="group bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 flex flex-col transition-all duration-300">
                  <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100/50 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="rgb(249 115 22)" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                      <path d="M9 12h6M9 16h4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="text-slate-800 font-extrabold text-sm mb-1.5">{paper.title || "Driving Theory Paper"}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed flex-1">Prepare yourself for the final exam by attending this model paper.</p>
                  <button onClick={() => handleStartExam(paper._id)} className="mt-5 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-md shadow-orange-500/10 active:scale-98">Start Exam →</button>
                </div>
              ))}
            </div>

            {/* Pagination Controls Mobile Optimized */}
            {examTotalPages > 1 && (
              <div className="flex justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
                <button disabled={examPage === 1} onClick={() => setExamPage(p => p - 1)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-slate-50 transition shadow-sm">← Prev</button>
                <span className="text-slate-500 text-xs font-semibold">Page {examPage} of {examTotalPages}</span>
                <button disabled={examPage === examTotalPages} onClick={() => setExamPage(p => p + 1)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-slate-50 transition shadow-sm">Next →</button>
              </div>
            )}
          </div>
        ) : (
          /* Active Exam Paper Worksheet View */
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              
              {/* Exam Header */}
              <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-slate-800 font-black text-base sm:text-lg leading-snug">{selectedPaper.title}</h2>
                  <p className="text-slate-400 text-xs font-bold mt-0.5">{selectedPaper.questions?.length} Questions Available</p>
                </div>
                <button onClick={() => setSelectedPaper(null)} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold transition shrink-0 ml-2">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>

              {/* Questions Stack */}
              <div className="p-5 sm:p-7 space-y-6 sm:space-y-8">
                {selectedPaper.questions?.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <p className="text-slate-800 text-xs sm:text-sm font-bold mb-4 leading-relaxed">
                      <span className="text-orange-500 font-black mr-1.5">{qIdx + 1}.</span>
                      {q.questionText}
                    </p>

                    {q.imageUrl && (
                      <div className="mb-4 max-w-[160px] sm:max-w-[180px] bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
                        <img src={q.imageUrl} alt={`Question ${qIdx + 1} Sign`} className="w-full h-auto object-contain rounded-lg"/>
                      </div>
                    )}

                    {/* Options grid stacking into 1 column automatically on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options?.map((opt: string, oIdx: number) => (
                        <label key={oIdx} className={`flex items-start sm:items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedAnswers[qIdx] === oIdx ? "border-orange-500 bg-orange-50/60 text-orange-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"}`}>
                          <input type="radio" name={`question-${qIdx}`} checked={selectedAnswers[qIdx] === oIdx} onChange={() => handleOptionChange(qIdx, oIdx)} className="accent-orange-500 w-3.5 h-3.5 mt-0.5 sm:mt-0 shrink-0"/>
                          <span className="text-[11px] sm:text-xs font-bold leading-normal">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Exam Actions Footer */}
              <div className="px-5 py-4 sm:px-7 sm:py-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center bg-slate-50/50">
                <span className="text-slate-400 text-xs font-bold order-2 sm:order-1">{Object.keys(selectedAnswers).length} / {selectedPaper.questions?.length} Answered</span>
                <button onClick={handleSubmitExam} className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white px-8 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase shadow-md shadow-orange-500/10 order-1 sm:order-2 text-center">Submit Answers</button>
              </div>
            </div>

            {/* Dialog Result Box Modal */}
            {examResult && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-xl transition-all">
                  <div className="text-5xl mb-4">{examResult.passed ? "🎉" : "😥"}</div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Exam Evaluated!</h3>
                  <p className="text-slate-400 text-xs font-bold mt-0.5 mb-5">Your performance result</p>
                  
                  <div className="mb-5 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-4xl sm:text-5xl font-black text-orange-500">{examResult.score}%</div>
                  </div>
                  
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${examResult.passed ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                    {examResult.passed ? "✓ Passed" : "✕ Failed"}
                  </span>
                  
                  <button onClick={() => { setSelectedPaper(null); setExamResult(null); }} className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-sm">Back to Exam Papers</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}