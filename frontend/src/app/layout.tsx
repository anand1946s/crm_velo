"use client";

import { Suspense, useState } from "react";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { ToastProvider } from "../context/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="h-screen p-5">
            <div className="flex h-full gap-5 relative">
              
              {/* Sidebar wrapper with collapsible transition */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
                isCollapsed ? "w-0 opacity-0 -mr-5 pointer-events-none" : "w-72 opacity-100"
              }`}>
                <Suspense fallback={<div className="w-72 h-full bg-white border border-slate-200 rounded-3xl animate-pulse" />}>
                  <Sidebar onToggle={() => setIsCollapsed(true)} />
                </Suspense>
              </div>

              {/* Main content pane */}
              <main className="flex-1 flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
                
                {/* Top Mini Header for Collapsed State */}
                {isCollapsed && (
                  <div className="flex items-center px-8 pt-6 pb-2 bg-white animate-slideDown">
                    <button
                      onClick={() => setIsCollapsed(false)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all hover:scale-105 cursor-pointer"
                    >
                      <Menu size={18} />
                    </button>
                  </div>
                )}

                <div className="flex-1 overflow-auto p-8">
                  {children}
                </div>
              </main>

            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}