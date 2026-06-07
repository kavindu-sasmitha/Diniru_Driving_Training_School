import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import teacher from "../assets/images/teacher1.png"

// Icons
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
    <div className="min-h-screen bg-zinc-950 font-sans antialiased text-white">

      {/* Top Promo Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-[10px] font-bold tracking-[2px] uppercase py-2.5 px-6 text-center">
        Call Today for Your Free Consultation: 077 123 4567 &nbsp;|&nbsp; Professional Driving Training Guaranteed
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              DINIRU<span className="text-orange-500">.</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            {["Home", "Packages", "Instructors", "Contact"].map((link, i) => (
              <a
                key={i}
                href={link === "Packages" ? "#packages" : link === "Instructors" ? "#instructors" : "#"}
                className="hover:text-white transition-colors duration-200 relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 px-5 py-2 rounded-xl transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-6 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
        {/* Subtle orange glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-32 md:py-44">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">Now Enrolling</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              <span className="block text-white">Learn to</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Drive Smart.
              </span>
              <span className="block text-white">Drive Safe.</span>
            </h1>

            <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-lg">
              Professional dual-controlled training with RMV certified instructors. Your license, our mission.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#packages"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm tracking-wide px-8 py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                View Packages
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#instructors"
                className="inline-flex items-center gap-2 border border-white/10 hover:border-white/25 hover:bg-white/5 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all duration-200"
              >
                Meet Instructors
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* Stats Bar */}
      <div className="border-y border-white/5 bg-zinc-900/50 py-8 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "800+", label: "Licensed Students" },
            { value: "15+", label: "Training Vehicles" },
            { value: "99%", label: "Pass Rate" },
            { value: "12+", label: "Years of Excellence" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl md:text-4xl font-black tracking-tight mb-1 ${i === 1 ? "text-orange-400" : "text-white"}`}>
                {stat.value}
              </div>
              <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <span className="text-orange-500 text-xs font-bold tracking-[3px] uppercase">Established 2012</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-6 leading-tight">
              Fully Licensed<br />Driving School
            </h2>
            <p className="text-zinc-400 leading-relaxed text-[17px] mb-10">
              We provide high-quality, practical driving education with modern vehicles and expert instructors.
              Our goal is to produce confident, responsible, and safe drivers.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {["RMV Certified", "Dual-Control Vehicles", "Flexible Scheduling", "99% Pass Rate"].map((tag, i) => (
                <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200"
                alt="Professional mechanic working on training vehicle"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/40 to-transparent" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg">✓</div>
              <div>
                <div className="text-white font-bold text-sm">Government Approved</div>
                <div className="text-zinc-500 text-xs">RMV Certified School</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-6 md:px-16 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🛡️", title: "Dual-Controlled Cars", desc: "Maximum safety with instructor dual pedals in every vehicle." },
            { icon: "⏰", title: "Flexible Scheduling", desc: "Learn at your convenience with morning, evening & weekend slots." },
            { icon: "📝", title: "Exam Preparation", desc: "Mock tests and practical training aligned with RMV standards." },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-7 bg-zinc-900 border border-white/5 hover:border-orange-500/30 rounded-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="text-3xl mb-5">{feature.icon}</div>
                <h4 className="font-bold text-lg text-white mb-2">{feature.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages Section */}
      <div id="packages" className="max-w-7xl mx-auto py-24 px-6 md:px-16 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-orange-500 text-xs font-bold tracking-[3px] uppercase">Our Services</span>
            <h3 className="text-4xl font-black tracking-tight text-white mt-2">Training Packages</h3>
          </div>
          <p className="text-zinc-500 mt-4 md:mt-0 max-w-xs text-sm">
            Choose the perfect package for your driving journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <div
                key={item._id || item.id || index}
                className="group relative bg-zinc-900 border border-white/5 hover:border-orange-500/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Top accent line */}
                <div className="h-0.5 w-0 bg-gradient-to-r from-orange-500 to-amber-400 group-hover:w-full transition-all duration-500" />

                <div className="p-7 flex-1">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <PackageIcon />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white leading-tight">
                        {item.name || "Driving License Course"}
                      </h4>
                      <span className="text-xs text-zinc-500 font-medium">Standard Package</span>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {item.description || "Comprehensive practical instruction covering standard test procedures, road signs, and defensive driving techniques."}
                  </p>
                </div>

                <div className="px-7 py-4 border-t border-white/5 bg-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-xs text-zinc-400 font-medium">Available Now</span>
                  </div>
                  <button className="text-orange-400 hover:text-orange-300 font-semibold text-sm flex items-center gap-1.5 transition-colors">
                    Details
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <div className="text-zinc-600 flex justify-center mb-4">
                <PackageIcon />
              </div>
              <p className="text-zinc-500 font-medium">No packages loaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructors Section */}
      <div id="instructors" className="bg-zinc-900/50 border-t border-white/5 py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-xs font-bold tracking-[3px] uppercase">Expert Team</span>
            <h3 className="text-4xl font-black tracking-tight text-white mt-3">Meet Our Instructors</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Instructor 1 */}
            <div className="group bg-zinc-900 border border-white/5 hover:border-orange-500/20 rounded-2xl overflow-hidden transition-all duration-300">
              <div
                className="h-72 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${teacher})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-2.5 py-1 bg-orange-500 text-white text-[10px] font-black tracking-widest uppercase rounded-lg">
                    Senior Instructor
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black text-white">Mr. Prabath Weerathunga</h4>
                <p className="text-zinc-500 text-xs font-mono mt-1 mb-3">Reg No: RMV/DIR/748</p>
                <p className="text-zinc-400 text-sm leading-relaxed">10+ years experience in heavy and light vehicle training.</p>
              </div>
            </div>

            {/* Instructor 2 */}
            <div className="group bg-zinc-900 border border-white/5 hover:border-orange-500/20 rounded-2xl overflow-hidden transition-all duration-300">
              <div
                className="h-72 bg-cover bg-center relative"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-2.5 py-1 bg-orange-500 text-white text-[10px] font-black tracking-widest uppercase rounded-lg">
                    Practical Expert
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black text-white">Mrs. Deepani Silva</h4>
                <p className="text-zinc-500 text-xs font-mono mt-1 mb-3">Reg No: RMV/DIR/902</p>
                <p className="text-zinc-400 text-sm leading-relaxed">Specialized in beginner training and RMV test preparation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative overflow-hidden py-20 px-6 md:px-16 border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Ready to Get Your License?
          </h3>
          <p className="text-zinc-400 mb-8 text-lg">Join 800+ students who trusted us to earn their license.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-orange-500/25 hover:-translate-y-0.5"
            >
              Create Account
            </button>
            <a
              href="tel:0771234567"
              className="border border-white/10 hover:border-white/25 hover:bg-white/5 text-white font-semibold px-10 py-3.5 rounded-xl transition-all duration-200"
            >
              077 123 4567
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;