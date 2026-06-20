"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  Settings, 
  Terminal, 
  Server, 
  Database,
  Cpu,
  RefreshCw,
  Sliders,
  Bell,
  Code2,
  Lock,
  Compass
} from "lucide-react";

interface AuditLog {
  id: number;
  action: string;
  performed_by: string;
  timestamp: string;
  details: string;
}

export default function AdminPage() {
  const [logs] = useState<AuditLog[]>([
    { id: 1, action: "ASSIGN_PROJECT", performed_by: "VeloAdmin", timestamp: "2026-06-20 17:42:01", details: "Assigned Alexandra Chen to Project Phoenix" },
    { id: 2, action: "PASSOUT_MEMBER", performed_by: "DiscordBot", timestamp: "2026-06-20 16:15:30", details: "Marked Elena Rostova as Alumni (Passout API trigger)" },
    { id: 3, action: "CREATE_PROJECT", performed_by: "VeloAdmin", timestamp: "2026-06-20 12:30:00", details: "Registered Project Phoenix in database" },
    { id: 4, action: "CREATE_PERSON", performed_by: "DiscordBot", timestamp: "2026-06-20 09:12:44", details: "Added active member Siddharth Nair via /addmember command" },
    { id: 5, action: "CREATE_PERSON", performed_by: "VeloAdmin", timestamp: "2026-06-19 14:02:18", details: "Added industry mentor Dr. Marcus Vance to advisors list" }
  ]);

  const [dbStatus] = useState({
    engine: "PostgreSQL 16",
    host: "localhost:5432",
    latency: "4 ms",
    status: "Healthy"
  });

  const [discordConfig, setDiscordConfig] = useState({
    botToken: "••••••••••••••••••••••••••••••••",
    clientId: "1098765432109876543",
    guildId: "876543210987654321",
    status: "Online"
  });

  const botCommands = [
    { command: "/addmember", target: "POST /persons", desc: "Adds an active student member to the registry" },
    { command: "/addmentor", target: "POST /persons", desc: "Registers an industry advisor contact" },
    { command: "/passout", target: "PUT /persons/{id}/passout", desc: "Marks a student member as alumni and sets end date" },
    { command: "/addproject", target: "POST /projects", desc: "Launches a new project pipeline entry" },
    { command: "/assignproject", target: "POST /projects/{id}/members", desc: "Assigns a developer to an engineering project" },
    { command: "/getperson", target: "GET /persons/{id}", desc: "Retrieves email, phone, and timeline of a member" },
    { command: "/getproject", target: "GET /projects/{id}", desc: "Reviews project roadmap, status, and active devs" },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="text-indigo-600" />
          <span>Platform Administration</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Configure server properties, check database engines, audit bot events, and review command endpoints.
        </p>
      </div>

      {/* System Status Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* API Core */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Server size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">API Endpoint Engine</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">FastAPI Backend</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Status</p>
              <p className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Version</p>
              <p className="font-bold text-slate-700 mt-0.5">v1.0.0 (VeloWiKi)</p>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Database Schema</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">SQLAlchemy Registry</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Engine</p>
              <p className="font-bold text-slate-700 mt-0.5">{dbStatus.engine}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Latency</p>
              <p className="font-bold text-slate-700 mt-0.5">{dbStatus.latency}</p>
            </div>
          </div>
        </div>

        {/* Discord Bot integration */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Terminal size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Discord Integration</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bot Command Gateway</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Connection</p>
              <p className="font-bold text-indigo-600 mt-0.5">{discordConfig.status}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Guild Server</p>
              <p className="font-bold text-slate-700 mt-0.5">VeloCET Dev</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Discord Bot Command reference */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="text-purple-600" size={18} />
              <span>Discord Slash Commands</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md tracking-wider">Gateway Enabled</span>
          </div>

          <div className="flex-1 overflow-auto max-h-[350px] space-y-3.5 pr-1">
            {botCommands.map((cmd, idx) => (
              <div key={idx} className="flex flex-col gap-1 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 font-mono bg-purple-50/50 px-2 py-0.5 rounded-md">{cmd.command}</span>
                  <span className="text-[9px] text-slate-400 font-semibold font-mono uppercase">{cmd.target}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                  {cmd.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="text-indigo-600" size={18} />
              <span>Security & Operation Logs</span>
            </h2>
            <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-auto max-h-[350px] space-y-3 pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    log.action.includes("CREATE") ? "bg-emerald-50 text-emerald-700" :
                    log.action.includes("ASSIGN") ? "bg-indigo-50 text-indigo-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>{log.action}</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <p className="mt-2 text-slate-700 font-medium">{log.details}</p>
                <p className="mt-1 text-[10px] text-slate-400">Triggered by: <span className="font-semibold">{log.performed_by}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
