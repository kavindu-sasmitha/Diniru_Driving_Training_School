import React, { type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard"; 
import AdminDashboard from "../pages/AdminDashboard";    
import { useAuth } from "../hooks/useAuth";

type RequireAuthTypes = {
  children: ReactNode;
  roles?: string[];
};


const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => user?.roles?.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};


const DashboardWrapper = () => {
  const { user } = useAuth();

  
  if (user?.roles?.includes("ADMIN")) {
    return <AdminDashboard />;
  }
  
  
  if (user?.roles?.includes("STUDENT")) {
    return <StudentDashboard />;
  }

  
  return <Navigate to="/home" replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirecting initial landing to the Public Home page instead of Login */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth roles={["STUDENT", "ADMIN"]}>
              
              <DashboardWrapper />
            </RequireAuth>
          }
        />

        {/* Fallback configuration for undefined routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;