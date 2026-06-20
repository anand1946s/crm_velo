import { Suspense } from "react";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="h-screen p-5">
          <div className="flex h-full gap-5">
            <Suspense fallback={<div className="w-72 h-full bg-white border border-slate-200 rounded-3xl animate-pulse" />}>
              <Sidebar />
            </Suspense>

            <main className="flex-1 overflow-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}