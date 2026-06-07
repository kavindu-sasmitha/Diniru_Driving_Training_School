import React, { useState, useEffect } from "react";
import api from "../service/api";

export default function AdminDashboard() {
  const [adminTab, setAdminTab] = useState<"students" | "addVideo" | "addExam" | "trainingStudents">("students");
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const [searchError, setSearchError] = useState("");

  // Payment & Exam Date Operation States
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
  const [installmentAmount, setInstallmentAmount] = useState<number>(0);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [newExamDate, setNewExamDate] = useState("");
  const [examDateSuccess, setExamDateSuccess] = useState("");

  // 📝 Account Approval State (අලුතින් එකතු කළා මචං)
  const [approveSuccess, setApproveSuccess] = useState("");
  const [loadingApprove, setLoadingApprove] = useState(false);

  // Training Students State
  const [trainingStudents, setTrainingStudents] = useState<any[]>([]);
  const [loadingTraining, setLoadingTraining] = useState(false);

  // Add Video States
  const [videoForm, setVideoForm] = useState({ title: "", description: "", videoUrl: "", category: "PRACTICAL" });
  const [videoSuccess, setVideoSuccess] = useState("");

  // Add Exam Paper States
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([
    { questionText: "", imageUrl: "", options: ["", "", "", ""], correctOptionIndex: 0 }
  ]);
  const [examSuccess, setExamSuccess] = useState("");

  // 🔍 Dynamic Search Form Submit
  const handleStudentSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchError("");
    setStudentData(null);
    setPaymentSuccess("");
    setExamDateSuccess("");
    setApproveSuccess("");

    try {
      const res = await api.get(`/auth/students/${searchQuery}`);
      setStudentData(res.data.data);
    } catch (err: any) {
      setSearchError(err.response?.data?.message || "No student record found.");
    }
  };

  
  const handleApproveStudent = async () => {
    if (!studentData || !studentData.userId?._id) return;
    setLoadingApprove(true);
    setApproveSuccess("");

    try {
      
      const res = await api.post(`/admin/approve/${studentData.userId._id}`, {});

      setApproveSuccess("Student account approved successfully! 🔐✨");
      
     
      setStudentData((prev: any) => ({
        ...prev,
        userId: {
          ...prev.userId,
          approved: true
        }
      }));
    } catch (err) {
      alert("Failed to approve student account. Please try again.");
    } finally {
      setLoadingApprove(false);
    }
  };

  // 💳 Payment Installment update
  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData) return;
    setPaymentSuccess("");

    try {
      
      const res = await api.post(`/admin/collect-payment`, {
        studentId: studentData.studentId,
        paidInstallmentNumbers: [selectedInstallment],
        amountPerInstallment: installmentAmount
      });

      setPaymentSuccess(`Installment ${selectedInstallment} updated to COMPLETED! ✅`);
      setStudentData(res.data.data); 
      setInstallmentAmount(0);
    } catch (err: any) {
      alert("Failed to update payment. Please try again.");
    }
  };

  // Exam Date update
  const handleUpdateExamDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData || !newExamDate) return;
    setExamDateSuccess("");

    try {
      
      const res = await api.post(`/admin/update-exam-date`, {
        studentId: studentData._id, 
        examDate: newExamDate
      });

      setExamDateSuccess("Exam Date updated successfully..! 🎯");
      setStudentData(res.data.data);
      setNewExamDate("");
    } catch (err) {
      alert("Failed to update Exam Date.");
    }
  };

  // Training Eligible Students Loading
  useEffect(() => {
    if (adminTab === "trainingStudents") {
      setLoadingTraining(true);
      api.get("/students/training-eligible")
        .then((res) => {
          setTrainingStudents(res.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching training students:", err);
        })
        .finally(() => {
          setLoadingTraining(false);
        });
    }
  }, [adminTab]);

  // Video Form Submit
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoSuccess("");
    try {
      await api.post("/videos/add", videoForm);
      setVideoSuccess("Driving tutorial added successfully! 🚀");
      setVideoForm({ title: "", description: "", videoUrl: "", category: "PRACTICAL" });
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic Exam Forms Logics
  const handleAddQuestionRow = () => {
    setQuestions([...questions, { questionText: "", imageUrl: "", options: ["", "", "", ""], correctOptionIndex: 0 }]);
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].questionText = text;
    setQuestions(updated);
  };

  const handleQuestionImageUrlChange = (index: number, url: string) => {
    const updated = [...questions];
    updated[index].imageUrl = url;
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = text;
    setQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex: number, val: number) => {
    const updated = [...questions];
    updated[qIndex].correctOptionIndex = val;
    setQuestions(updated);
  };

  const handlePublishExamPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setExamSuccess("");
    const payload = { title: examTitle, questions: questions };
    try {
      await api.post("/exams/create", payload); 
      setExamSuccess("Exam Paper created and published successfully..! 🎉");
      setExamTitle("");
      setQuestions([{ questionText: "", imageUrl: "", options: ["", "", "", ""], correctOptionIndex: 0 }]);
    } catch (err) {
      console.error("Failed to create exam paper:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 mb-8 justify-center">
            <span className="text-2xl">👑</span>
            <h2 className="text-xl font-bold tracking-wider text-slate-100">Admin Panel</h2>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setAdminTab("students")}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-sm font-medium transition-all ${adminTab === "students" ? "bg-slate-800 text-amber-400 font-semibold shadow-lg" : "text-slate-300 hover:bg-slate-800"}`}
            >
              <span>🧑‍🎓</span> <span>Manage Students</span>
            </button>
            <button
              onClick={() => setAdminTab("trainingStudents")}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-sm font-medium transition-all ${adminTab === "trainingStudents" ? "bg-slate-800 text-amber-400 font-semibold shadow-lg" : "text-slate-300 hover:bg-slate-800"}`}
            >
              <span>🚗</span> <span>Training Trainees</span>
              {trainingStudents.length > 0 && (
                <span className="ml-auto bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  {trainingStudents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAdminTab("addVideo")}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-sm font-medium transition-all ${adminTab === "addVideo" ? "bg-slate-800 text-amber-400 font-semibold shadow-lg" : "text-slate-300 hover:bg-slate-800"}`}
            >
              <span>📹</span> <span>Upload Video</span>
            </button>
            <button
              onClick={() => setAdminTab("addExam")}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-sm font-medium transition-all ${adminTab === "addExam" ? "bg-slate-800 text-amber-400 font-semibold shadow-lg" : "text-slate-300 hover:bg-slate-800"}`}
            >
              <span>📝</span> <span>Add Exam Paper</span>
            </button>
          </nav>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl text-center text-sm font-semibold transition shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-8">
        
        {/* ── 🧑‍🎓 MANAGE STUDENTS TAB ── */}
        {adminTab === "students" && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900">Student Profiles & Billing</h1>
              <p className="text-gray-500 text-sm mt-1">Search student profile details, collect payment installments, and set theory exam dates dynamically.</p>
            </div>

            {/* Search Input Group */}
            <form onSubmit={handleStudentSearch} className="flex space-x-3 max-w-xl mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Student ID (e.g. DDS260001), NIC, or Phone Number..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-800 text-xs bg-white shadow-sm"
              />
              <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-semibold transition shadow-md">Search</button>
            </form>

            {searchError && <div className="text-red-600 text-xs font-semibold bg-red-50 border border-red-200 p-3 rounded-xl mb-4 inline-block">{searchError}</div>}

            {/* Main Student Console Wrapper */}
            {studentData && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                
                {/* Left Column: Student Profile Details */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-5">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                        <span>📋</span> <span>Student Profile Details ({studentData.studentId || "No ID"})</span>
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${studentData.userId?.approved ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                        {studentData.userId?.approved ? "APPROVED ACCESS" : "PENDING VERIFICATION"}
                      </span>
                    </div>

                    {approveSuccess && <div className="text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-xl mb-4 text-xs font-semibold">{approveSuccess}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <p className="text-gray-400 font-medium">Student Full Name</p>
                        <p className="text-gray-800 font-bold text-sm mt-0.5">{studentData.userId?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Email Address</p>
                        <p className="text-gray-800 font-bold text-sm mt-0.5">{studentData.userId?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">NIC Number</p>
                        <p className="text-gray-800 font-bold text-sm mt-0.5">{studentData.nicNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Phone Number</p>
                        <p className="text-gray-800 font-bold text-sm mt-0.5">{studentData.userId?.phoneNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-400 font-medium">Residential Address</p>
                        <p className="text-gray-800 font-bold text-sm mt-0.5">{studentData.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Current Scheduled Exam Date</p>
                        <p className="text-orange-600 font-black text-sm mt-0.5">
                          {studentData.examDate ? new Date(studentData.examDate).toLocaleDateString() : "Not Scheduled Yet ❌"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Installments History Matrix */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                        <span>💰</span> <span>Payment Milestones Ledger</span>
                      </h3>
                      <div className="flex items-center space-x-2 text-xs font-bold">
                        <span className="text-gray-400 font-normal">Status:</span>
                        <span className={`px-2 py-0.5 rounded ${studentData.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-800" : studentData.paymentStatus === "PARTIAL" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                          {studentData.paymentStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400">
                            <th className="pb-2 font-semibold">Installment</th>
                            <th className="pb-2 font-semibold">Amount Paid</th>
                            <th className="pb-2 font-semibold">Settled Date</th>
                            <th className="pb-2 font-semibold text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                          {studentData.paymentHistory?.map((pay: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="py-2.5 text-gray-900 font-bold">Installment #{pay.installmentNumber}</td>
                              <td className="py-2.5 text-slate-700 font-mono">Rs. {pay.amount.toLocaleString()}.00</td>
                              <td className="py-2.5 text-gray-500">
                                {pay.paidDate ? new Date(pay.paidDate).toLocaleString() : "-"}
                              </td>
                              <td className="py-2.5 text-right">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${pay.status === "COMPLETED" ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                                  {pay.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column: Operations Panel (Approve Button, Collect Payments & Exam Dates) */}
                <div className="space-y-6">
                  
                  {/* Student Access Verification Button  */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-slate-800">
                      <span>🔐</span> Access Authorization
                    </h4>
                    <p className="text-gray-500 text-[11px] mb-3 leading-relaxed">
                      Approve this profile to grant access for attempting dynamic model exam papers.
                    </p>
                    <button
                      type="button"
                      disabled={studentData.userId?.approved || loadingApprove}
                      onClick={handleApproveStudent}
                      className={`w-full font-bold py-2.5 rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-1.5 ${
                        studentData.userId?.approved
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed"
                          : "bg-slate-800 hover:bg-slate-900 text-white"
                      }`}
                    >
                      {loadingApprove ? (
                        "Processing Approval..."
                      ) : studentData.userId?.approved ? (
                        <>
                          <span>✓</span> Account Approved
                        </>
                      ) : (
                        "Approve Account Now"
                      )}
                    </button>
                  </div>
                  
                  {/* Operation A: Collect Installments */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-slate-800">
                      <span>💳</span> Update Installment
                    </h4>
                    {paymentSuccess && <div className="text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-xl mb-3 text-[11px] font-semibold">{paymentSuccess}</div>}
                    
                    <form onSubmit={handleUpdatePayment} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1 font-medium">Select Pending Milestone</label>
                        <select 
                          value={selectedInstallment} 
                          onChange={(e) => setSelectedInstallment(parseInt(e.target.value))}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                        >
                          {studentData.paymentHistory?.map((p: any) => (
                            <option key={p.installmentNumber} value={p.installmentNumber} disabled={p.status === "COMPLETED"}>
                              Installment {p.installmentNumber} {p.status === "COMPLETED" ? " (Paid)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1 font-medium">Received Amount (Rs.)</label>
                        <input 
                          type="number" 
                          required 
                          value={installmentAmount || ""} 
                          onChange={(e) => setInstallmentAmount(parseInt(e.target.value))}
                          placeholder="e.g., 5000"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-800"
                        />
                      </div>
                      <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-xl transition text-[11px] shadow-sm">
                        Confirm Collection
                      </button>
                    </form>
                  </div>

                  {/* Operation B: Set/Change Theory Exam Date */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-slate-800">
                      <span>📅</span> Schedule Theory Exam
                    </h4>
                    {examDateSuccess && <div className="text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-xl mb-3 text-[11px] font-semibold">{examDateSuccess}</div>}
                    
                    <form onSubmit={handleUpdateExamDate} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-1 font-medium">New Exam Date</label>
                        <input 
                          type="date" 
                          required 
                          value={newExamDate} 
                          onChange={(e) => setNewExamDate(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
                        />
                      </div>
                      <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl transition text-[11px] shadow-sm">
                        Update Exam Date
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/*  TRAINING ELIGIBLE TRAINEES TAB ── */}
        {adminTab === "trainingStudents" && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900">Training Trainees Call-List</h1>
              <p className="text-gray-500 text-sm mt-1">Students whose assigned Theory Exam dates were over 75 days ago. Eligible to start practical vehicle training sessions immediately.</p>
            </div>

            {loadingTraining ? (
              <div className="text-xs font-medium text-gray-500">Loading scheduled data stack...</div>
            ) : trainingStudents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-xs font-medium text-gray-400">
                No students found with over 75 days elapsed since their exam date. 🎉
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                        <th className="p-4">Student ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Contact No</th>
                        <th className="p-4">Exam Date</th>
                        <th className="p-4">Days Elapsed</th>
                        <th className="p-4 text-right">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {trainingStudents.map((student: any) => {
                        const exam = new Date(student.examDate);
                        const today = new Date();
                        const diffTime = Math.abs(today.getTime() - exam.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        return (
                          <tr key={student._id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="p-4 text-gray-900 font-bold">{student.studentId}</td>
                            <td className="p-4 font-semibold text-slate-800">{student.userId?.name}</td>
                            <td className="p-4 font-mono text-gray-600">{student.userId?.phoneNumber || "-"}</td>
                            <td className="p-4 text-orange-600 font-bold">{exam.toLocaleDateString()}</td>
                            <td className="p-4">
                              <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-black border border-red-100">
                                {diffDays} Days Ago
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${student.paymentStatus === "COMPLETED" ? "bg-green-50 text-green-700 border border-green-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                                {student.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 📹 UPLOAD VIDEO TAB ── */}
        {adminTab === "addVideo" && (
          <div className="max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Upload Driving Tutorial</h1>
            <p className="text-gray-500 text-xs mb-6">Publish a new clip to the student video feed library</p>
            
            {videoSuccess && <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl mb-4 text-xs font-semibold">{videoSuccess}</div>}
            
            <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Video Clip Title</label>
                <input type="text" required value={videoForm.title} onChange={(e) => setVideoForm({...videoForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-800 focus:outline-none"/>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Detailed Description</label>
                <textarea rows={3} required value={videoForm.description} onChange={(e) => setVideoForm({...videoForm, description: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-800 focus:outline-none"/>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">YouTube Video Link URL</label>
                <input type="url" required value={videoForm.videoUrl} onChange={(e) => setVideoForm({...videoForm, videoUrl: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-800 focus:outline-none"/>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Lesson Category Tag</label>
                <select value={videoForm.category} onChange={(e) => setVideoForm({...videoForm, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none">
                  <option value="PRACTICAL">Practical Test Tips</option>
                  <option value="THEORY">Theory Lessons</option>
                  <option value="ROAD_RULES">Road Rules & Signs</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition text-xs mt-4 shadow-md">Publish Clip</button>
            </form>
          </div>
        )}

        {/* ── 📝 ADD EXAM PAPER TAB ── */}
        {adminTab === "addExam" && (
          <div className="max-w-3xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Create Theory Exam Paper</h1>
            <p className="text-gray-500 text-xs mb-6">Build a dynamic MCQ evaluation structure with answers for student access</p>

            {examSuccess && <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl mb-4 text-xs font-semibold">{examSuccess}</div>}

            <form onSubmit={handlePublishExamPaper} className="space-y-6 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Exam Paper Title</label>
                <input 
                  type="text" 
                  required 
                  value={examTitle} 
                  onChange={(e) => setExamTitle(e.target.value)} 
                  placeholder="e.g., Light Vehicle Theory Test - 01"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-slate-800 focus:outline-none"
                />
              </div>

              {/* Dynamic Question List Iterator Mapping */}
              <div className="space-y-6 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2">MCQ Questions Stack</h3>
                
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 relative">
                    <span className="absolute top-3 right-4 font-bold text-gray-300">#{qIdx + 1}</span>
                    
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Question Statement</label>
                      <input 
                        type="text" 
                        required 
                        value={q.questionText} 
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        placeholder="Type the question here..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Traffic Sign Image URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input 
                        type="url" 
                        value={q.imageUrl || ""} 
                        onChange={(e) => handleQuestionImageUrlChange(qIdx, e.target.value)}
                        placeholder="e.g., https://your-storage.com/signs/u-turn.png"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt: string, oIdx: number) => (
                        <div key={oIdx}>
                          <label className="block text-gray-500 text-[10px] mb-0.5">Option {oIdx + 1}</label>
                          <input 
                            type="text" 
                            required 
                            value={opt} 
                            onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                            placeholder={`Answer choice ${oIdx + 1}`}
                            className="w-full border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="w-1/2">
                      <label className="block text-gray-600 font-semibold mb-1">Correct Answer Index</label>
                      <select 
                        value={q.correctOptionIndex} 
                        onChange={(e) => handleCorrectOptionChange(qIdx, parseInt(e.target.value))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
                      >
                        <option value={0}>Option 1 is correct</option>
                        <option value={1}>Option 2 is correct</option>
                        <option value={2}>Option 3 is correct</option>
                        <option value={3}>Option 4 is correct</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={handleAddQuestionRow}
                  className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-xl transition shadow-sm"
                >
                  ➕ Add Question
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl transition shadow-md"
                >
                  Publish Exam Paper
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}