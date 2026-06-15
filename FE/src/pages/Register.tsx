import React, { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { register } from "../service/authService";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation(); 


  const googleName = location.state?.googleName || "";
  const googleEmail = location.state?.googleEmail || "";

  
  const [name, setName] = useState(googleName);
  const [email, setEmail] = useState(googleEmail);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [address, setAddress] = useState(""); 
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");

  const handleRegister = async () => {
    
    if (!name || !email || !phoneNumber || !nicNumber || !address || !password || !conformPassword) {
      return alert("Required all fields!");
    }
    if (password !== conformPassword) {
      return alert("Passwords do not match!");
    }
    
    try {
      
      await register({ name, email, phoneNumber, nicNumber, address, password });
      alert("Registration success..!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] font-sans antialiased p-4 sm:p-6 relative overflow-hidden py-10 sm:py-16">
      
      {/* Background Subtle Accent Geometry - Mobile responsive sizes */}
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#FF5500]/5 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-slate-900/[0.02] pointer-events-none" />

      {/* --- Main Register Card Box --- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 w-full max-w-md overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Top Decorative Branding Bar */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 text-center border-b-4 border-[#FF5500]">
          <div className="text-xl font-black tracking-wider uppercase mb-1">
            DINIRU<span className="text-[#FF5500]">.</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            Driving Training School
          </p>
        </div>

        {/* Form Body Container - Smooth scroll for mobile keyboards */}
        <div className="p-6 sm:p-10 max-h-[78vh] sm:max-h-none overflow-y-auto scrollbar-thin">
          <div className="text-center mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              {/* 🆕 Google එකෙන් ආ කෙනෙක් නම් උපදෙස වෙනස් කර පෙන්වීම */}
              {googleEmail ? "Complete Profile" : "Create Account"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {googleEmail 
                ? "Google account linked! Please fill out the remaining details." 
                : "Join our student portal to manage your lessons."}
            </p>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {/* Name Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="John Doe"
                disabled={!!googleName} // 🆕 Google එකෙන් නම ඇවිත් නම් මේ field එක block (disabled) වේ
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all disabled:opacity-70 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
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
                disabled={!!googleEmail} // 🆕 Google එකෙන් Email එක ඇවිත් නම් මේ field එක block (disabled) වේ
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all disabled:opacity-70 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Phone Number Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="0771234567"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* NIC Number Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                NIC Number
              </label>
              <input
                value={nicNumber}
                onChange={(e) => setNicNumber(e.target.value)}
                type="text"
                placeholder="200112345678 or 991234567V"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* Address Input Field  */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Home Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="No. 45, Temple Road, Sooriyawewa"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-neutral-900 focus:bg-white transition-all"
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
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* Confirm Password Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* Action Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleRegister}
                className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white p-3.5 rounded-xl text-xs font-extrabold tracking-widest uppercase shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
              >
                Register & Save
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Bottom Navigation Link */}
            <div className="text-xs text-center text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span>Already have an Account?</span>
              <button
                onClick={() => navigate("/login")}
                className="text-[#FF5500] font-black hover:underline tracking-wide focus:outline-none uppercase text-[10px] sm:text-[11px] cursor-pointer mt-0.5 sm:mt-0"
              >
                Login
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;