"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  FolderGit2, 
  Plus, 
  Calendar, 
  UserPlus, 
  UserMinus, 
  CheckCircle2, 
  Hourglass, 
  XCircle,
  Users,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface ProjectMember {
  person_id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABORTED";
  start_date: string;
  end_date?: string;
  members: ProjectMember[];
}

interface Person {
  id: number;
  name: string;
  email: string;
  type: string;
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const isViewer = (session?.user as any)?.role === "viewer";
  const { showToast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
  const [projects, setProjects] = useState<Project[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forms State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "IN_PROGRESS" as "IN_PROGRESS" | "COMPLETED" | "ABORTED",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });

  // Member Assignment Form
  const [assigningProjectId, setAssigningProjectId] = useState<number | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const projRes = await fetch(`${API_URL}/projects/`);
      const peopleRes = await fetch(`${API_URL}/persons/`);
      if (!projRes.ok || !peopleRes.ok) {
        throw new Error("Backend connection failed");
      }
      const projData = await projRes.json();
      const peopleData = await peopleRes.json();

      setProjects(projData);
      setPeople(peopleData);
    } catch (err) {
      console.warn("Backend API not reachable.", err);
      setProjects([]);
      setPeople([]);
      setErrorMsg(`Failed to connect to backend projects database at ${API_URL}. Ensure uvicorn is running.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    const payload = {
      name: formData.name,
      description: formData.description || null,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
    };

    try {
      const res = await fetch(`${API_URL}/projects/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to register project.");
      showToast(`Project "${payload.name}" launched successfully!`, "success");
      await loadData();
      setShowCreateForm(false);
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (id: number, status: "IN_PROGRESS" | "COMPLETED" | "ABORTED") => {
    if (isViewer) return;
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      showToast("Project status updated successfully!", "success");
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (isViewer) return;
    if (!confirm("Are you sure you want to remove this project?")) return;

    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project.");
      showToast("Project removed successfully!", "success");
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssignMember = async (e: React.FormEvent, projectId: number) => {
    e.preventDefault();
    if (isViewer) return;
    if (!selectedPersonId) return;

    const personId = parseInt(selectedPersonId);
    const person = people.find((p) => p.id === personId);
    if (!person) return;

    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person_id: personId }),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.detail || "Failed to assign member.");
      }

      showToast("Developer assigned successfully!", "success");
      await loadData();
      setAssigningProjectId(null);
      setSelectedPersonId("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemoveMember = async (projectId: number, personId: number) => {
    if (isViewer) return;
    if (!confirm("Remove this member from project?")) return;

    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/members/${personId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove member.");
      showToast("Developer unassigned successfully!", "success");
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };


  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "IN_PROGRESS",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  const filteredProjects = projects.filter((p) => {
    return !statusFilter || p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FolderGit2 className="text-indigo-600" />
            <span>Projects Board</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track product pipelines, assign developers, and review project lifecycles.
          </p>
        </div>

        {!isViewer && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Launch Project</span>
          </button>
        )}
      </div>

      {/* Connection Warning */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          <AlertCircle className="text-rose-600 shrink-0" size={18} />
          <div>
            <span className="font-bold">Database Server Offline:</span> {errorMsg}
          </div>
        </div>
      )}

      {/* Launch Project Form */}
      {showCreateForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-slideDown">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FolderGit2 className="text-indigo-600" size={20} />
            <span>Configure Project Blueprint</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Project Apollo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ABORTED">Aborted / Postponed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Completion Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Overview / Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Detail key goals, tech stacks, and team scopes..."
              />
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); resetForm(); }}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm cursor-pointer"
              >
                Deploy Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Options */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
        {[
          { label: "All Pipelines", status: null },
          { label: "In Progress", status: "IN_PROGRESS" },
          { label: "Completed", status: "COMPLETED" },
          { label: "Aborted", status: "ABORTED" },
        ].map((tab) => {
          const active = statusFilter === tab.status;
          return (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.status)}
              className={`px-4 py-2 text-xs font-bold rounded-xl tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Projects Cards Board Layout */}
      {loading ? (
        <div className="flex h-60 items-center justify-center bg-white border border-slate-200 rounded-3xl">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="text-xs font-semibold text-slate-400">Syncing active project lists...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl text-center">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-3">
            <FolderGit2 size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No projects listed</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Build a new project pipeline or check alternative statuses.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const isExpanded = expandedProjectId === project.id;
            return (
              <div key={project.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase flex items-center gap-1.5 mt-1.5">
                        <Calendar size={12} />
                        Started: {project.start_date}
                        {project.end_date && ` - Ended: ${project.end_date}`}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                        project.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        project.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                    {project.description || "No project overview provided."}
                  </p>

                  {/* Status update controls */}
                  {!isViewer && (
                    <div className="mt-4 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Move To:</span>
                      {[
                        { status: "IN_PROGRESS", label: "Ongoing", color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
                        { status: "COMPLETED", label: "Completed", color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
                        { status: "ABORTED", label: "Aborted", color: "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200" }
                      ].map((btn) => (
                        <button
                          key={btn.status}
                          disabled={project.status === btn.status}
                          onClick={() => handleStatusChange(project.id, btn.status as any)}
                          className={`text-[10px] font-bold px-2 py-0.5 border border-slate-100 rounded-md transition-colors ${
                            project.status === btn.status
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : `bg-transparent text-slate-600 cursor-pointer ${btn.color}`
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Collapsible member list */}
                <div className="mt-5 border-t border-slate-100 pt-4 space-y-3">
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      Team Members ({project.members ? project.members.length : 0})
                    </span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 animate-slideDown">
                      {project.members && project.members.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {project.members.map((m) => (
                            <div key={m.person_id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 truncate">{m.name}</p>
                                <p className="text-[9px] text-slate-400 truncate">{m.email}</p>
                              </div>
                              {!isViewer && (
                                <button
                                  title="Remove member"
                                  onClick={() => handleRemoveMember(project.id, m.person_id)}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                >
                                  <UserMinus size={12} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No developers assigned.</p>
                      )}

                      {/* Add member section */}
                      {!isViewer && (
                        <div className="pt-2">
                          {assigningProjectId === project.id ? (
                            <form onSubmit={(e) => handleAssignMember(e, project.id)} className="flex items-center gap-2">
                              <select
                                required
                                value={selectedPersonId}
                                onChange={(e) => setSelectedPersonId(e.target.value)}
                                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                              >
                                <option value="">Choose Developer...</option>
                                {people
                                  // Avoid listing people already assigned
                                  .filter((person) => !project.members?.some((m) => m.person_id === person.id))
                                  .map((person) => (
                                    <option key={person.id} value={person.id}>
                                      {person.name} ({person.type})
                                    </option>
                                  ))}
                              </select>
                              <button
                                type="submit"
                                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 text-xs cursor-pointer"
                              >
                                Assign
                              </button>
                              <button
                                type="button"
                                onClick={() => { setAssigningProjectId(null); setSelectedPersonId(""); }}
                                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 text-xs text-slate-500 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <button
                              onClick={() => setAssigningProjectId(project.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                            >
                              <UserPlus size={12} />
                              <span>Assign Developer</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer actions */}
                  {!isViewer && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Remove Project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
