import React, { useState, useEffect } from "react";
import api from "../service/api";

export default function UploadVideo() {
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    category: "PRACTICAL",
  });
  const [videoSuccess, setVideoSuccess] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");

  // Fetch all videos (Updated to match Backend Route: /get-all)
  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Backend එකේ pagination තියෙන නිසා ඔක්කොම වීඩියෝ පෙන්වන්න limit එක 100ක් වගේ වැඩි කරලා යවනවා
      const res = await api.get("/videos/get-all?page=1&limit=100");
      // Backend එකෙන් එන්නේ { message: "...", data: [...] } නිසා res.data.data ලබා ගන්නවා
      setVideos(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoSuccess("");
    try {
      await api.post("/videos/add", videoForm);
      setVideoSuccess("Driving tutorial added successfully! 🚀");
      setVideoForm({
        title: "",
        description: "",
        videoUrl: "",
        category: "PRACTICAL",
      });
      fetchVideos(); // ලැයිස්තුව refresh කරනවා
    } catch (err) {
      console.error(err);
      alert("Failed to add video. Please try again.");
    }
  };

  // Delete Video (Updated to match Backend Route: /delete/:id)
  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      // Backend එකේ route එක /delete/:id නිසා path එක නිවැරදි කරා
      await api.delete(`/videos/delete/${videoId}`);
      setDeleteSuccess("Video deleted successfully.");
      fetchVideos(); // මකපු ගමන් අලුත් ලැයිස්තුව ලෝඩ් කරනවා
      setTimeout(() => setDeleteSuccess(""), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete video.");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Upload Driving Tutorial
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Publish a new clip to the student video feed library, or manage existing videos.
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        {videoSuccess && (
          <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl mb-4 text-xs font-semibold">
            {videoSuccess}
          </div>
        )}
        <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Video Clip Title
            </label>
            <input
              type="text"
              required
              value={videoForm.title}
              onChange={(e) =>
                setVideoForm({ ...videoForm, title: e.target.value })
              }
              placeholder="e.g., How to do a Perfect Parallel Parking"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              required
              value={videoForm.description}
              onChange={(e) =>
                setVideoForm({ ...videoForm, description: e.target.value })
              }
              placeholder="Provide brief steps or guidelines about the tutorial video clip..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              YouTube Video Link URL
            </label>
            <input
              type="url"
              required
              value={videoForm.videoUrl}
              onChange={(e) =>
                setVideoForm({ ...videoForm, videoUrl: e.target.value })
              }
              placeholder="e.g., https://www.youtube.com/watch?v=..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Lesson Category Tag
            </label>
            <select
              value={videoForm.category}
              onChange={(e) =>
                setVideoForm({ ...videoForm, category: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none"
            >
              <option value="PRACTICAL">Practical Test Tips</option>
              <option value="THEORY">Theory Lessons</option>
              <option value="ROAD_RULES">Road Rules & Signs</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition text-xs mt-4 shadow-md"
          >
            Publish Clip
          </button>
        </form>
      </div>

      {/* Existing Videos List with Delete */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Uploaded Videos
        </h2>
        {deleteSuccess && (
          <div className="text-green-700 bg-green-50 border border-green-200 p-2.5 rounded-xl mb-4 text-xs font-semibold">
            {deleteSuccess}
          </div>
        )}
        {loading ? (
          <div className="text-center py-6 text-xs text-gray-500 animate-pulse">
            Loading videos...
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 text-xs">No videos uploaded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="p-3 font-semibold text-gray-600">Title</th>
                  <th className="p-3 font-semibold text-gray-600">Category</th>
                  <th className="p-3 font-semibold text-gray-600">URL</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {videos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-gray-800">
                      {video.title}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {video.category}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 truncate max-w-[200px]">
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {video.videoUrl}
                      </a>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
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