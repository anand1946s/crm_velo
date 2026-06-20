"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Users, 
  Search, 
  UserPlus, 
  GraduationCap, 
  Trash2, 
  UserMinus, 
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface Membership {
  id: number;
  person_id: number;
  doj?: string;
  dol?: string;
}

interface Person {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  type: "MEMBER" | "ALUMNI" | "MENTOR";
  membership?: Membership;
}

// Separate component to safely use searchParams inside a Suspense boundary
function PersonsContent() {
  const { showToast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterType = searchParams.get("type"); // MEMBER, ALUMNI, MENTOR

  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    type: "MEMBER" as "MEMBER" | "ALUMNI" | "MENTOR",
    doj: "",
    dol: "",
  });

  const loadPeople = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_URL}/persons/`);
      if (!response.ok) {
        throw new Error("Unable to fetch persons from backend");
      }
      const data = await response.json();
      setPersons(data);
    } catch (err) {
      console.warn("Backend API offline.", err);
      setErrorMsg(`Failed to connect to backend registry at ${API_URL}. Ensure uvicorn server is active.`);
      setPersons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob || null,
      type: formData.type,
      doj: (formData.type !== "MENTOR" && formData.doj) ? formData.doj : null,
      dol: (formData.type === "ALUMNI" && formData.dol) ? formData.dol : null,
    };

    try {
      const res = await fetch(`${API_URL}/persons/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || "Error creating person profile.");
      }

      showToast(`${payload.name} registered successfully!`, "success");
      await loadPeople();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handlePassout = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/persons/${id}/passout`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to process passout status.");
      showToast("Member marked as Alumni successfully!", "success");
      await loadPeople();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this person profile?")) return;

    try {
      const res = await fetch(`${API_URL}/persons/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete person.");
      showToast("Contact profile deleted successfully!", "success");
      await loadPeople();
    } catch (err: any) {
      alert(err.message);
    }
  };


  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      dob: "",
      type: "MEMBER",
      doj: "",
      dol: "",
    });
  };

  const changeTab = (tabType: string | null) => {
    if (tabType) {
      router.push(`/persons?type=${tabType}`);
    } else {
      router.push(`/persons`);
    }
  };

  // Filter & Search Logic
  const filteredPersons = persons.filter((p) => {
    const matchesTab = !filterType || p.type === filterType;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-600" />
            <span>People Directory</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage club members, track alumni timelines, and connect with advisors.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer"
        >
          <UserPlus size={16} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Connection Warning Banner */}
      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          <AlertCircle className="text-rose-600 shrink-0" size={18} />
          <div>
            <span className="font-bold">Database Server Offline:</span> {errorMsg}
          </div>
        </div>
      )}

      {/* Forms Drawer */}
      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-slideDown">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UserPlus className="text-indigo-600" size={20} />
            <span>New Person Registry Entry</span>
          </h2>
          
          {errorMsg && (
            <div className="mb-4 text-xs font-semibold p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="john.doe@velocet.org"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="MEMBER">Active Member</option>
                <option value="ALUMNI">Alumni</option>
                <option value="MENTOR">Mentor</option>
              </select>
            </div>

            {formData.type !== "MENTOR" && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date of Joining</label>
                <input
                  type="date"
                  name="doj"
                  value={formData.doj}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {formData.type === "ALUMNI" && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date of Leaving</label>
                <input
                  type="date"
                  name="dol"
                  value={formData.dol}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="md:col-span-3 flex items-center gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm cursor-pointer"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search Bar Container */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: "All", type: null },
            { label: "Active Members", type: "MEMBER" },
            { label: "Alumni Network", type: "ALUMNI" },
            { label: "Mentors", type: "MENTOR" },
          ].map((tab) => {
            const active = filterType === tab.type;
            return (
              <button
                key={tab.label}
                onClick={() => changeTab(tab.type)}
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

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Grid table view */}
      {loading ? (
        <div className="flex h-60 items-center justify-center bg-white border border-slate-200 rounded-3xl">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="text-xs font-semibold text-slate-400">Syncing database registry...</p>
          </div>
        </div>
      ) : filteredPersons.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl text-center">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-3">
            <Users size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No contacts found</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Try adjusting your search queries or filter categories, or add a new person registry.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact Information</th>
                  <th className="px-6 py-4">Status & Details</th>
                  <th className="px-6 py-4">Timelines</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPersons.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          person.type === "MEMBER" ? "bg-indigo-50 text-indigo-700" :
                          person.type === "ALUMNI" ? "bg-emerald-50 text-emerald-700" :
                          "bg-purple-50 text-purple-700"
                        }`}>
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{person.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{person.type}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-slate-400" />
                          <span>{person.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-slate-400" />
                          <span>{person.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          person.type === "MEMBER" ? "bg-indigo-100 text-indigo-800" :
                          person.type === "ALUMNI" ? "bg-emerald-100 text-emerald-800" :
                          "bg-purple-100 text-purple-800"
                        }`}>
                          {person.type === "MEMBER" ? "Active" : person.type === "ALUMNI" ? "Graduate" : "Advisor"}
                        </span>
                        {person.dob && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar size={10} />
                            Born: {person.dob}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {person.type !== "MENTOR" && person.membership ? (
                        <div className="space-y-1 text-xs text-slate-600">
                          {person.membership.doj && (
                            <p><span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Joined:</span> {person.membership.doj}</p>
                          )}
                          {person.type === "ALUMNI" && person.membership.dol && (
                            <p><span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">Left:</span> {person.membership.dol}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No timeline tracking</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {person.type === "MEMBER" && (
                          <button
                            title="Mark as Alumni"
                            onClick={() => handlePassout(person.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                          >
                            <GraduationCap size={16} />
                          </button>
                        )}
                        <button
                          title="Delete Contact"
                          onClick={() => handleDelete(person.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PersonsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading Directory...</p>
        </div>
      </div>
    }>
      <PersonsContent />
    </Suspense>
  );
}
