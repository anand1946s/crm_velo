"use client";

import { Suspense, useState, useEffect } from "react";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { ToastProvider } from "../context/ToastContext";
import AuthProvider from "../components/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <div className="h-screen p-3 md:p-5">
              <div className="flex h-full gap-3 md:gap-5 relative">
                
                {/* Backdrop overlay for mobile views */}
                {!isCollapsed && (
                  <div 
                    onClick={() => setIsCollapsed(true)} 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
                  />
                )}

                {/* Sidebar wrapper with collapsible transition */}
                <div className={`transition-all duration-300 ease-in-out shrink-0 
                  fixed md:relative z-40 md:z-0 left-3 top-3 bottom-3 md:left-auto md:top-auto md:bottom-auto 
                  h-[calc(100vh-24px)] md:h-full 
                  ${isCollapsed 
                    ? "w-0 opacity-0 -translate-x-[120%] md:translate-x-0 pointer-events-none md:-mr-5" 
                    : "w-[calc(100vw-24px)] max-w-72 opacity-100 translate-x-0 md:w-72"
                  }`}
                >
                  <Suspense fallback={<div className="w-72 h-full bg-white border border-slate-200 rounded-3xl animate-pulse" />}>
                    <Sidebar onToggle={() => setIsCollapsed(true)} />
                  </Suspense>
                </div>

                {/* Main content pane */}
                <main className="flex-1 flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
                  
                  {/* Top Mini Header for Collapsed State */}
                  {isCollapsed && (
                    <div className="flex items-center px-4 md:px-8 pt-4 md:pt-6 pb-2 bg-white animate-slideDown">
                      <button
                        onClick={() => setIsCollapsed(false)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all hover:scale-105 cursor-pointer"
                      >
                        <Menu size={18} />
                      </button>
                    </div>
                  )}

                  <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                  </div>
                </main>

              </div>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}