import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import teacher from "../assets/images/teacher1.png";

const PackageIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M6 12h12" />
  </svg>
);

const Home = () => {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchAllItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/items");
      if (res.data) setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  return (
    <div className="min-h-screen font-sans antialiased overflow-x-hidden bg-white text-[#111827]">
      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 border-b py-5 px-6 md:px-12 bg-white/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#15803d] rounded-2xl flex items-center justify-center shadow">
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tighter">DINIRU</div>
              <div className="text-[10px] font-bold tracking-[2px] uppercase -mt-1 text-[#15803d]">DRIVING SCHOOL</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold">
            {[
              { label: "HOME", href: "#" },
              { label: "PACKAGES", href: "#packages" },
              { label: "INSTRUCTORS", href: "#instructors" },
              { label: "ABOUT", href: "#about" },
              { label: "CONTACT", href: "#contact" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="hover:text-[#15803d] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#15803d] group-hover:w-full transition-all" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-sm font-semibold border border-gray-300 rounded-2xl hover:border-[#15803d] hover:text-[#15803d] transition-all"
            >
              SIGN IN
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 text-sm font-bold bg-[#15803d] text-white rounded-2xl hover:bg-[#166534] transition-all shadow"
            >
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-3xl mb-6 border border-white/30">
            <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse" />
            <span className="uppercase text-xs tracking-[3px] font-bold">NOW ENROLLING</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-4">
            LEARN TO DRIVE<br />
            <span className="text-[#4ade80]">SMART.</span> DRIVE<br />
            SAFE.
          </h1>

          <p className="max-w-md mx-auto text-lg text-white/80 mb-10">
            Professional RMV certified training with modern dual-controlled vehicles
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#packages"
              className="inline-flex items-center justify-center gap-3 bg-white text-black font-bold px-10 py-4 rounded-2xl hover:bg-gray-100 transition-all text-lg"
            >
              VIEW PACKAGES
              <span className="text-xl">→</span>
            </a>
            <a
              href="#instructors"
              className="inline-flex items-center justify-center gap-3 border border-white/70 text-white font-semibold px-10 py-4 rounded-2xl hover:bg-white/10 transition-all"
            >
              MEET OUR TEAM
            </a>
          </div>
        </div>

        {/* Floating badges like in the reference */}
        <div className="absolute bottom-12 left-12 hidden lg:block bg-white/95 backdrop-blur rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#15803d] rounded-2xl flex items-center justify-center text-white text-3xl">✓</div>
            <div>
              <div className="font-bold text-lg text-black">RMV Certified</div>
              <div className="text-sm text-gray-500">Government Approved</div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/3 right-12 hidden xl:block bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl text-black">
          <div className="text-sm font-bold">15+ DUAL CONTROL VEHICLES</div>
          <div className="text-xs text-gray-500">Modern Fleet</div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-[#f8fafc] border-y py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { value: "800+", label: "Students Licensed" },
            { value: "99%", label: "Pass Rate" },
            { value: "15+", label: "Training Vehicles" },
            { value: "12+", label: "Years Experience" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-5xl font-black text-[#15803d] mb-1">{stat.value}</div>
              <div className="text-sm font-medium tracking-wider uppercase text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUPPORT / ABOUT SECTION ── */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="uppercase text-xs tracking-[3px] font-bold text-[#15803d]">ESTABLISHED 2012</span>
          <h2 className="text-5xl font-black tracking-tighter mt-4 leading-none">
            YOUR PARTNER IN<br />SAFE DRIVING
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed">
            We provide high-quality, practical driving education with modern vehicles and expert instructors.
            Our goal is to produce confident, responsible, and safe drivers.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {["RMV Certified", "Dual-Control Vehicles", "Flexible Timing", "Mock Tests"].map((tag) => (
              <span
                key={tag}
                className="px-6 py-3 bg-[#f0fdf4] text-[#15803d] text-sm font-semibold rounded-2xl border border-[#86efac]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Green accent box like in reference */}
        <div className="relative">
          <div className="bg-gradient-to-br from-[#15803d] to-[#4ade80] text-white p-10 rounded-3xl h-full flex flex-col justify-center">
            <div className="uppercase text-sm tracking-widest opacity-75 mb-2">SUPPORT AT EVERY STAGE</div>
            <div className="text-3xl font-bold leading-tight">
              From beginner to test-ready — we’ve got you covered
            </div>
            <div className="mt-8 text-sm opacity-90">
              Expert instructors • Modern fleet • Guaranteed results
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="bg-[#f8fafc] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="uppercase text-xs tracking-[3px] font-bold text-[#15803d]">WHY CHOOSE US</span>
            <h3 className="text-4xl font-black tracking-tighter mt-3">Our Advantages</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🛡️", title: "DUAL CONTROL", desc: "Maximum safety with instructor pedals in every car" },
              { icon: "🌱", title: "FLEXIBLE", desc: "Morning, evening & weekend classes available" },
              { icon: "⚡", title: "HIGH SUCCESS", desc: "99% pass rate with structured training" },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#86efac] group transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#f0fdf4] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="font-bold text-2xl mb-3">{f.title}</h4>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PACKAGES ── (unchanged logic, updated design) */}
      <div id="packages" className="max-w-7xl mx-auto py-24 px-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="uppercase text-xs tracking-[3px] font-bold text-[#15803d]">OUR SERVICES</span>
            <h3 className="text-5xl font-black tracking-tighter mt-2">Training Packages</h3>
          </div>
          <p className="text-gray-500 max-w-xs mt-4 md:mt-0">
            Choose the perfect package for your driving journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <div
                key={item._id || index}
                className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-[#86efac] hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-1.5 bg-gradient-to-r from-[#15803d] to-[#4ade80] w-0 group-hover:w-full transition-all" />

                <div className="p-8">
                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-[#f0fdf4] rounded-2xl text-[#15803d]">
                      <PackageIcon />
                    </div>
                    <div>
                      <h4 className="font-bold text-2xl leading-tight">{item.name || "Full Course"}</h4>
                      <div className="text-sm text-gray-400 mt-1">Standard • Comprehensive</div>
                    </div>
                  </div>

                  <p className="mt-8 text-gray-600 text-[15px] leading-relaxed">
                    {item.description || "Practical instruction covering test procedures, road signs, and defensive driving."}
                  </p>
                </div>

                <div className="border-t p-6 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    AVAILABLE NOW
                  </div>
                  <button className="text-[#15803d] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                    DETAILS →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl">
              No packages loaded yet
            </div>
          )}
        </div>
      </div>

      {/* ── INSTRUCTORS ── */}
      <div id="instructors" className="bg-[#f8fafc] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="uppercase text-xs tracking-[3px] font-bold text-[#15803d]">EXPERT TEAM</span>
            <h3 className="text-5xl font-black tracking-tighter mt-3">Meet Our Instructors</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Instructor 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#86efac] transition-all group">
              <div
                className="h-80 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${teacher})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-[#15803d] text-white text-xs font-bold px-4 py-1.5 rounded-2xl tracking-wider">SENIOR INSTRUCTOR</span>
                </div>
              </div>
              <div className="p-8">
                <h4 className="font-bold text-2xl">Mr. Prabath Weerathunga</h4>
                <div className="text-xs text-gray-400 font-mono mt-1">RMV/DIR/748</div>
                <p className="mt-4 text-gray-600">10+ years experience in heavy and light vehicle training.</p>
              </div>
            </div>

            {/* Instructor 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#86efac] transition-all group">
              <div
                className="h-80 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-[#15803d] text-white text-xs font-bold px-4 py-1.5 rounded-2xl tracking-wider">PRACTICAL EXPERT</span>
                </div>
              </div>
              <div className="p-8">
                <h4 className="font-bold text-2xl">Mrs. Deepani Silva</h4>
                <div className="text-xs text-gray-400 font-mono mt-1">RMV/DIR/902</div>
                <p className="mt-4 text-gray-600">Specialized in beginner training and RMV test preparation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      <div id="contact" className="bg-[#052e16] text-white py-28 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center px-6 relative z-10">
          <span className="uppercase tracking-[3px] text-[#4ade80] text-sm font-bold">READY TO START?</span>
          <h3 className="text-5xl font-black tracking-tighter mt-6">Get Your License With Confidence</h3>
          <p className="mt-6 text-lg text-white/70">Join 800+ successful students</p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
            <button
              onClick={() => navigate("/register")}
              className="bg-[#4ade80] hover:bg-[#86efac] text-black font-bold px-12 py-5 rounded-3xl text-lg transition-all"
            >
              CREATE ACCOUNT
            </button>
            <a
              href="tel:0771234567"
              className="border border-white/50 hover:bg-white/10 font-semibold px-12 py-5 rounded-3xl text-lg transition-all"
            >
              CALL 077 123 4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;