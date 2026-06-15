import React, { type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useOutletContext } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard"; 
import AdminDashboard from "../pages/AdminDashboard";    
import VideoTutorials from "../pages/VideoTutorials";
import ExamPapers from "../pages/ExamPapers";
import StudyGuide from "../pages/StudyGuide";
import { useAuth } from "../hooks/useAuth";
// 🆕 Google Authentication Provider එක Import කිරීම
import { GoogleOAuthProvider } from "@react-oauth/google";

type RequireAuthTypes = {
  children: ReactNode;
  roles?: string[];
};

// 🔐 Authentication & Role Guard Component
const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => user?.roles?.includes(role))) {
    return (
      <div className="text-center py-20 bg-zinc-950 h-screen text-white">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-zinc-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

// 🔀 Role-Based Dashboard Wrapper
const DashboardWrapper = () => {
  const { user } = useAuth();

  // Admin නම් Admin Dashboard එක පෙන්වන්න
  if (user?.roles?.includes("ADMIN")) {
    return <AdminDashboard />;
  }
  
  // Student නම් Nested Routes වැඩ කරන්න StudentDashboard Layout එක දෙන්න
  if (user?.roles?.includes("STUDENT")) {
    return <StudentDashboard />;
  }

  return <Navigate to="/home" replace />;
};

// 💡 Sub-pages වලට AI Panel Context එක Pass කරන Helper Component එක
function ContextConsumer({ Component }: { Component: React.ComponentType<any> }) {
  const context = useOutletContext<{ setAiPanelOpen: (open: boolean) => void }>();
  return <Component setAiPanelOpen={context?.setAiPanelOpen} />;
}

export const AppRouter = () => {
  const renderWithProps = (Component: React.ComponentType<any>) => {
    return <ContextConsumer Component={Component} />;
  };

  // 🆕 .env ෆයිල් එකෙන් ආරක්ෂිතව Google Client ID එක කියවා ගැනීම
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  return (
    // 🆕 Hardcoded string එක වෙනුවට .env variable එක මෙතනට ආදේශ කළා
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🛡️ Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth roles={["STUDENT", "ADMIN"]}>
                <DashboardWrapper />
              </RequireAuth>
            }
          >
            {/* Student Dashboard එක ඇතුළේ වැඩ කරන Sub-Routes ටික */}
            <Route index element={<Navigate to="/dashboard/videos" replace />} />
            <Route path="videos" element={renderWithProps(VideoTutorials)} />
            <Route path="exams" element={renderWithProps(ExamPapers)} />
            <Route path="book" element={renderWithProps(StudyGuide)} />
          </Route>

          {/* Fallback configuration for undefined routes */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default AppRouter;