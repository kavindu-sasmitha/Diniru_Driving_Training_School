import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { login, getMyDetails } from "../service/authService";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-sans antialiased p-6 relative overflow-hidden">
      
      {/* Background Subtle Accent Geometry */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5500]/5 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neutral-900/[0.02] pointer-events-none" />

      {/* --- Main Login Card Box --- */}
      <div className="bg-white rounded-none border border-neutral-200 shadow-xl w-full max-w-md overflow-hidden relative z-10">
        
        {/* Top Decorative Branding Bar */}
        <div className="bg-neutral-900 text-white p-8 text-center border-b-4 border-[#FF5500]">
          <div className="text-xl font-black tracking-wider uppercase mb-1">
            DINIRU<span className="text-[#FF5500]">.</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">
            Driving Training School
          </p>
        </div>

        {/* Form Body Container */}
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">
              Welcome Back
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Log in to secure your student portal dashboard.
            </p>
          </div>

          <div className="space-y-5">
            {/* Email Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="student@example.com"
                className="w-full p-3.5 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full p-3.5 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Action Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleLogin}
                className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white p-3.5 rounded-none text-xs font-bold tracking-widest uppercase shadow-md hover:shadow-lg transition-all duration-200"
              >
                Sign In
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            {/* Bottom Navigation Link */}
            <p className="text-xs text-center text-neutral-500 flex items-center justify-center gap-2">
              <span>New to Diniru Driving School?</span>
              <button
                onClick={() => navigate("/register")}
                className="text-[#FF5500] font-bold hover:underline tracking-wide focus:outline-none uppercase text-[11px]"
              >
                Register here
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;