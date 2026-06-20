"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FolderGit2,
  GraduationCap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Calendar,
  Sparkles
} from "lucide-react";

interface Person {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  members: any[];
}

export default function DashboardPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const [stats, setStats] = useState({
    members: 0,
    alumni: 0,
    mentors: 0,
    projects: 0,
  });
  const [recentPeople, setRecentPeople] = useState<Person[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const personsRes = await fetch(`${API_URL}/persons/`);
        const projectsRes = await fetch(`${API_URL}/projects/`);
        if (!personsRes.ok || !projectsRes.ok) {
          throw new Error("Failed to fetch from backend");
        }

        const persons: Person[] = await personsRes.json();
        const projects: Project[] = await projectsRes.json();

        const membersCount = persons.filter(p => p.type === "MEMBER").length;
        const alumniCount = persons.filter(p => p.type === "ALUMNI").length;
        const mentorsCount = persons.filter(p => p.type === "MENTOR").length;

        setStats({
          members: membersCount,
          alumni: alumniCount,
          mentors: mentorsCount,
          projects: projects.length,
        });

        setRecentPeople(persons.slice(0, 5));
        setRecentProjects(projects.slice(0, 4));
        setErrorMsg(null);
      } catch (err) {
        console.warn("Backend API not reachable.", err);
        setStats({
          members: 0,
          alumni: 0,
          mentors: 0,
          projects: 0,
        });
        setRecentPeople([]);
        setRecentProjects([]);
        setErrorMsg(`Failed to connect to backend database registry at ${API_URL}. Ensure your python virtual environment uvicorn server is active.`);
      } finally {
        setLoading(false);
      }
    }


    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading VeloWiki Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-striped-dark px-6 py-8 md:px-8 md:py-10 text-white shadow-lg">
        {/* Decorative ambient blobs */}


        <div className="relative z-10 max-w-2xl">
          {/* <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-200 backdrop-blur-md mb-4 border border-white/10">
            <Sparkles size={12} className="text-amber-400" />
            <span>Welcome to VeloWiki</span>
          </div> */}
          <h1 className="font-manrope font-[800] text-3xl tracking-tight md:text-4xl">
            VeloCET Club Database
          </h1>
          <p className="font-manrope font-[500] mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Monitor Members, Alumni and Projects
          </p>
        </div>

        {errorMsg && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 text-xs text-rose-200 backdrop-blur-md">
            <ShieldAlert size={14} />
            <span>API Server Offline</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          <ShieldAlert className="text-rose-600 shrink-0" size={18} />
          <div>
            <span className="font-bold">Database Server Offline:</span> {errorMsg}
          </div>
        </div>
      )}


      {/* Metric Cards Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: " Members",
            value: stats.members,
            icon: UserCheck,
            color: "indigo",
            desc: "Active student members"
          },
          {
            title: "Alumni",
            value: stats.alumni,
            icon: GraduationCap,
            color: "emerald",
            desc: "Graduates"
          },
          {
            title: "Mentors",
            value: stats.mentors,
            icon: Users,
            color: "purple",
            desc: "Industry advisors"
          },
          {
            title: "Total Projects",
            value: stats.projects,
            icon: FolderGit2,
            color: "sky",
            desc: ""
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.title}</p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</h3>
                </div>
                <div className={`rounded-2xl p-3.5 bg-${stat.color}-50 text-${stat.color}-600`}>
                  {/* Tailwind arbitrary styling backup classes */}
                  <Icon size={24} className={`
                    ${stat.color === 'indigo' ? 'text-indigo-600' : ''}
                    ${stat.color === 'emerald' ? 'text-emerald-600' : ''}
                    ${stat.color === 'purple' ? 'text-purple-600' : ''}
                    ${stat.color === 'sky' ? 'text-sky-600' : ''}
                  `} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-medium">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Projects</h2>
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              <span>View Board</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {recentProjects.map((proj) => (
              <div key={proj.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm truncate max-w-[150px]">{proj.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${proj.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      proj.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                      {proj.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {proj.description || "No project description defined."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Contributers
                  </span>
                  <span>{proj.members ? proj.members.length : 0} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Directory Registry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent </h2>
            <Link href="/persons" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              <span>Full List</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3.5">
            {recentPeople.map((person) => (
              <div key={person.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${person.type === "MEMBER" ? "bg-indigo-50 text-indigo-600" :
                    person.type === "ALUMNI" ? "bg-emerald-50 text-emerald-600" :
                      "bg-purple-50 text-purple-600"
                    }`}>
                    {person.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{person.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{person.email}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wider ${person.type === "MEMBER" ? "bg-indigo-50/50 text-indigo-700" :
                  person.type === "ALUMNI" ? "bg-emerald-50/50 text-emerald-700" :
                    "bg-purple-50/50 text-purple-700"
                  }`}>
                  {person.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
