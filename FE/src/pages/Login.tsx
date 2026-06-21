import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { login, getMyDetails } from "../service/authService";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Required all fields!");
    }
    try {
      const data = await login(email, password);
      const accessToken = data?.accessToken;
      const refreshToken = data?.refreshToken;
      if (accessToken && refreshToken) {
        localStorage.setItem("ACCESS_TOKEN", accessToken);
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
        const profileData = await getMyDetails();
        setUser(profileData?.user || profileData);
        navigate("/dashboard");
      } else {
        alert("Login failed!");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/google-check", { token: idToken });
      if (res.data.status === "SUCCESS") {
        localStorage.setItem("ACCESS_TOKEN", res.data.accessToken);
        localStorage.setItem("REFRESH_TOKEN", res.data.refreshToken);
        const profileData = await getMyDetails();
        setUser(profileData?.user || profileData);
        navigate("/dashboard");
      } else if (res.data.status === "NOT_FOUND") {
        navigate("/register", {
          state: {
            googleName: res.data.name,
            googleEmail: res.data.email
          }
        });
      }
    } catch (err: any) {
      console.error("Google Authentication Error:", err);
      alert(err.response?.data?.message || "Google Authentication Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans antialiased p-4 sm:p-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#15803d]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4ade80]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/70 w-full max-w-md overflow-hidden relative z-10">
        {/* Top Branding Bar */}
        <div className="bg-[#052e16] text-white p-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-[#15803d] rounded-2xl flex items-center justify-center">
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black tracking-tighter">DINIRU</div>
          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#4ade80] -mt-1">
            DRIVING SCHOOL
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to access your student dashboard
            </p>
          </div>

          <div className="space-y-6">
            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Sign-In was unsuccessful. Please try again.")}
                theme="outline"
                size="large"
                width="100%"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 tracking-wider">
                EMAIL ADDRESS
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="student@example.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#15803d] focus:bg-white outline-none transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 tracking-wider">
                PASSWORD
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#15803d] focus:bg-white outline-none transition-all text-sm"
              />
              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-[#15803d] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-[#15803d] hover:bg-[#166534] text-white py-4 rounded-2xl font-bold tracking-wider text-sm transition-all active:scale-[0.985]"
            >
              SIGN IN
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-500">
              New to Diniru Driving School?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#15803d] font-semibold hover:underline"
              >
                Register here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;