import React, { useState, useEffect } from "react";
import api from "../service/api";

export default function AddExamPaper() {
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([
    {
      questionText: "",
      imageUrl: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
    },
  ]);
  const [examSuccess, setExamSuccess] = useState("");
  const [examPapers, setExamPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");

  // Fetch all exam papers (Updated to match Backend Route: /exams/papers)
  const fetchExamPapers = async () => {
    setLoading(true);
    try {
      // Backend එකේ pagination තියෙන නිසා ඔක්කොම papers පෙන්වන්න limit එක 100ක් දාලා request කරනවා
      const res = await api.get("/exams/papers?page=1&limit=100");
      // Backend එකෙන් return කරන්නේ { message: "...", data: [...] } නිසා res.data.data ලබා ගන්නවා
      setExamPapers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch exam papers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamPapers();
  }, []);

  const handleAddQuestionRow = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        imageUrl: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
      },
    ]);
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

  const handleOptionTextChange = (
    qIndex: number,
    oIndex: number,
    text: string
  ) => {
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
    const payload = { title: examTitle, questions };
    try {
      await api.post("/exams/create", payload);
      setExamSuccess("Exam Paper created and published successfully..! 🎉");
      setExamTitle("");
      setQuestions([
        {
          questionText: "",
          imageUrl: "",
          options: ["", "", "", ""],
          correctOptionIndex: 0,
        },
      ]);
      fetchExamPapers(); // refresh list
    } catch (err) {
      console.error("Failed to create exam paper:", err);
      alert("Failed to publish exam. Please try again.");
    }
  };

  // Delete Exam Paper (Updated to match Backend Route: /exams/papers/:id)
  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm("Are you sure you want to delete this exam paper?")) return;
    try {
      // Backend එකේ delete route එක router.delete("/papers/:id") නිසා path එක වෙනස් කරා
      await api.delete(`/exams/papers/${examId}`);
      setDeleteSuccess("Exam paper deleted successfully.");
      fetchExamPapers(); // මැකුණට පස්සේ අලුත් ලිස්ට් එක refresh කරනවා
      setTimeout(() => setDeleteSuccess(""), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete exam paper.");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Create Theory Exam Paper
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Build a dynamic MCQ evaluation structure with answers for student access, or manage existing papers.
        </p>
      </div>

      {/* Add Exam Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        {examSuccess && (
          <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl mb-4 text-xs font-semibold">
            {examSuccess}
          </div>
        )}
        <form onSubmit={handlePublishExamPaper} className="space-y-6 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Exam Paper Title
            </label>
            <input
              type="text"
              required
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="e.g., Light Vehicle Theory Test - 01"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-slate-800 focus:outline-none"
            />
          </div>

          <div className="space-y-6 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2">
              MCQ Questions Stack
            </h3>

            {questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 relative"
              >
                <span className="absolute top-3 right-4 font-bold text-gray-300">
                  #{qIdx + 1}
                </span>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Question Statement
                  </label>
                  <input
                    type="text"
                    required
                    value={q.questionText}
                    onChange={(e) =>
                      handleQuestionTextChange(qIdx, e.target.value)
                    }
                    placeholder="Type the question here..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">
                    Traffic Sign Image URL{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={q.imageUrl || ""}
                    onChange={(e) =>
                      handleQuestionImageUrlChange(qIdx, e.target.value)
                    }
                    placeholder="e.g., https://your-storage.com/signs/u-turn.png"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt: string, oIdx: number) => (
                    <div key={oIdx}>
                      <label className="block text-gray-500 text-[10px] mb-0.5">
                        Option {oIdx + 1}
                      </label>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) =>
                          handleOptionTextChange(qIdx, oIdx, e.target.value)
                        }
                        placeholder={`Answer choice ${oIdx + 1}`}
                        className="w-full border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="w-full md:w-1/2 pt-2">
                  <label className="block text-gray-600 font-semibold mb-1">
                    Correct Answer Index
                  </label>
                  <select
                    value={q.correctOptionIndex}
                    onChange={(e) =>
                      handleCorrectOptionChange(qIdx, parseInt(e.target.value))
                    }
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

      {/* Existing Exam Papers List with Delete */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Published Exam Papers
        </h2>
        {deleteSuccess && (
          <div className="text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-xl mb-4 text-xs font-semibold">
            {deleteSuccess}
          </div>
        )}
        {loading ? (
          <div className="text-center py-6 text-xs text-gray-500 animate-pulse">
            Loading exam papers...
          </div>
        ) : examPapers.length === 0 ? (
          <div className="text-center py-8 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 text-xs">No exam papers published yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="p-3 font-semibold text-gray-600">Title</th>
                  <th className="p-3 font-semibold text-gray-600">Questions</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {examPapers.map((exam) => (
                  <tr key={exam._id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-gray-800">
                      {exam.title}
                    </td>
                    <td className="p-3 text-gray-500">
                      {exam.questions?.length || 0} questions
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteExam(exam._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg transition text-[10px]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}