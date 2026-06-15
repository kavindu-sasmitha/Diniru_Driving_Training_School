import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { login, getMyDetails } from "../service/authService";
// 🆕 Google Authentication සඳහා අවශ්‍ය කොටස් Import කරගැනීම
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
      // Axios interceptor instance standard endpoints structure wrapper
      const data = await login(email, password);
      const accessToken = data?.accessToken;
      const refreshToken = data?.refreshToken;

      if (accessToken && refreshToken) {
        localStorage.setItem("ACCESS_TOKEN", accessToken);
        localStorage.setItem("REFRESH_TOKEN", refreshToken);

        // Call user context details profile mapping using customized axios service
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

  // 🆕 Google Login එක සාර්ථක වූ විට ක්‍රියාත්මක වන Smart Handler එක
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential; // Google එකෙන් දෙන ආරක්ෂිත Token එක
    
    try {
      // Backend එකට Token එක යවා පරිශීලකයා දැනටමත් DB එකේ සිටීදැයි පරීක්ෂා කිරීම
      const res = await axios.post("http://localhost:5000/api/v1/auth/google-check", { token: idToken });
      
      if (res.data.status === "SUCCESS") {
        // ශිෂ්‍යයා දැනටමත් ලියාපදිංචි වී සිටී නම් කෙලින්ම Dashboard එකට
        localStorage.setItem("ACCESS_TOKEN", res.data.accessToken);
        localStorage.setItem("REFRESH_TOKEN", res.data.refreshToken);
        
        const profileData = await getMyDetails();
        setUser(profileData?.user || profileData);
        navigate("/dashboard");
      } else if (res.data.status === "NOT_FOUND") {
        // ⚡ ශිෂ්‍යයා අලුත් කෙනෙක් නම්, Google දත්තද සමඟින් ඔහුව Register පෝරමයට හරවා යැවීම
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
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] font-sans antialiased p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Subtle Accent Geometry */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#FF5500]/5 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-slate-900/[0.02] pointer-events-none" />

      {/* --- Main Login Card Box --- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 w-full max-w-md overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Top Decorative Branding Bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center border-b-4 border-[#FF5500]">
          <div className="text-xl font-black tracking-wider uppercase mb-1">
            DINIRU<span className="text-[#FF5500]">.</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            Driving Training School
          </p>
        </div>

        {/* Form Body Container */}
        <div className="p-6 sm:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Log in to secure your student portal dashboard.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            
            {/* 🆕 Official Google Login Button Integration */}
            <div className="flex justify-center w-full pt-1 pb-1">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Sign-In was unsuccessful. Please try again.")}
                theme="outline"
                size="large"
                width="100%"
                text="signin_with"
                shape="circle"
              />
            </div>

            {/* Content Divider Text */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Or login with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="student@example.com"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* Action Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleLogin}
                className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white p-3.5 rounded-xl text-xs font-extrabold tracking-widest uppercase shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
              >
                Sign In
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Bottom Navigation Link */}
            <div className="text-xs text-center text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span>New to Diniru Driving School?</span>
              <button
                onClick={() => navigate("/register")}
                className="text-[#FF5500] font-black hover:underline tracking-wide focus:outline-none uppercase text-[10px] sm:text-[11px] mt-1 sm:mt-0"
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