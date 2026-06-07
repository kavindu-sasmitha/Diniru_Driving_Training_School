import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../service/authService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [address, setAddress] = useState(""); 
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Check all input constraints mapping before making request
    if (!name || !email || !phoneNumber || !nicNumber || !address || !password || !conformPassword) {
      return alert("Required all fields!");
    }
    if (password !== conformPassword) {
      return alert("Passwords do not match!");
    }
    
    try {
      // Passing the complete dataset with address matching backend service structure
      await register({ name, email, phoneNumber, nicNumber, address, password });
      alert("Registration success..!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-sans antialiased p-6 relative overflow-hidden">
      
      {/* Background Subtle Accent Geometry */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF5500]/5 rounded-br-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neutral-900/[0.02] pointer-events-none" />

      {/* --- Main Register Card Box --- */}
      <div className="bg-white rounded-none border border-neutral-200 shadow-xl w-full max-w-md overflow-hidden relative z-10">
        
        {/* Top Decorative Branding Bar */}
        <div className="bg-neutral-900 text-white p-6 text-center border-b-4 border-[#FF5500]">
          <div className="text-xl font-black tracking-wider uppercase mb-1">
            DINIRU<span className="text-[#FF5500]">.</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">
            Driving Training School
          </p>
        </div>

        {/* Form Body Container */}
        <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">
              Create Account
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Join our student portal to manage your lessons.
            </p>
          </div>

          <div className="space-y-4">
            {/* Name Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="John Doe"
                className="w-full p-3 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

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
                className="w-full p-3 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Phone Number Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="0771234567"
                className="w-full p-3 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* NIC Number Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                NIC Number
              </label>
              <input
                value={nicNumber}
                onChange={(e) => setNicNumber(e.target.value)}
                type="text"
                placeholder="200112345678 or 991234567V"
                className="w-full p-3 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Address Input Field  */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Home Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="No. 45, Temple Road, Sooriyawewa"
                className="w-full p-3 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
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
                className="w-full p-3 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Confirm Password Input Field */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-[#F8F9FA] border border-neutral-200 rounded-none text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Action Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleRegister}
                className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white p-3.5 rounded-none text-xs font-bold tracking-widest uppercase shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Register
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            {/* Bottom Navigation Link */}
            <p className="text-xs text-center text-neutral-500 flex items-center justify-center gap-2">
              <span>Already have an Account?</span>
              <button
                onClick={() => navigate("/login")}
                className="text-[#FF5500] font-bold hover:underline tracking-wide focus:outline-none uppercase text-[11px] cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;