"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login interaction
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/";
    }, 1200);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-[-50%] right-[-10%] h-[180px] w-[180px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50%] left-[-10%] h-[180px] w-[180px] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        {/* Logo and title */}
        <div className="text-center relative z-10">
          <div className="mx-auto relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 mb-4 shadow-inner">
            <Image
              src="/icons/velo.png"
              alt="VeloCET Logo"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          
          <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 tracking-wide uppercase mb-3">
            <Sparkles size={10} className="text-amber-500" />
            <span>VeloCET Core Registry</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to VeloWiki
          </h2>
          <p className="mt-1.5 text-xs font-medium text-slate-500">
            Secure client ledger administration database
          </p>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="admin@velocet.org"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick link guides */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" 
                defaultChecked 
              />
              <span>Remember workstation</span>
            </label>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Reset credential keys?
            </a>
          </div>

          {/* Action button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <span>Access Database Workspace</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
