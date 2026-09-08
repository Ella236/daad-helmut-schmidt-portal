import { useState, useMemo } from "react";
import { type Applicant, type DocStatus } from "../data/applicants";

const STATUS_COLS = [
  { key: "Application Form", short: "App Form" },
  { key: "Checklist", short: "Checklist" },
  { key: "Degree", short: "Degree" },
  { key: "Transcript", short: "Transcript" },
  { key: "Language", short: "Language" },
  { key: "Passport", short: "Passport" },
  { key: "CV", short: "CV" },
  { key: "Proof of Work", short: "Proof Work" },
  { key: "Reference", short: "Ref." },
  { key: "Motivation", short: "Motivation" },
  { key: "Research Proposal", short: "Proposal" },
];

function StatusPill({ status }: { status: DocStatus | "—" }) {
  if (status === "—") return <span className="text-gray-200 text-xs">—</span>;
  const cls =
    status === "Valid"
      ? "bg-green-100 text-green-800"
      : status === "Invalid"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";
  return (
    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${cls}`}>
      {status === "Unchecked" ? "?" : status}
    </span>
  );
}

function OverallBadge({ applicant }: { applicant: Applicant }) {
  const hasInvalid = applicant.documents.some((d) => d.aiAnalysis.status === "Invalid");
  const hasUnchecked = applicant.documents.some((d) => d.aiAnalysis.status === "Unchecked");
  if (hasInvalid)
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />Issues</span>;
  if (hasUnchecked)
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />Review</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Complete</span>;
}

interface Props {
  applicants: Applicant[];
  onSelect: (a: Applicant) => void;
}

export default function ApplicantList({ applicants, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Complete" | "Issues" | "Review">("All");
  const [filterNationality, setFilterNationality] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "applicantNo" | "status">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  const nationalities = useMemo(() => {
    const all = Array.from(new Set(applicants.map((a) => a.nationality))).sort();
    return ["All", ...all];
  }, [applicants]);

  const filtered = useMemo(() => {
    let list = applicants.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.lastName.toLowerCase().includes(q) ||
        a.firstName.toLowerCase().includes(q) ||
        a.applicantNo.includes(q) ||
        a.nationality.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q);

      const hasInvalid = a.documents.some((d) => d.aiAnalysis.status === "Invalid");
      const hasUnchecked = a.documents.some((d) => d.aiAnalysis.status === "Unchecked");
      const matchFilter =
        filterStatus === "All" ||
        (filterStatus === "Complete" && !hasInvalid && !hasUnchecked) ||
        (filterStatus === "Issues" && hasInvalid) ||
        (filterStatus === "Review" && hasUnchecked && !hasInvalid);

      const matchNat = filterNationality === "All" || a.nationality === filterNationality;
      const matchGender = filterGender === "All" || a.gender === filterGender;

      return matchSearch && matchFilter && matchNat && matchGender;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      if (sortBy === "applicantNo") cmp = a.applicantNo.localeCompare(b.applicantNo);
      if (sortBy === "status") {
        const score = (x: Applicant) =>
          x.documents.some((d) => d.aiAnalysis.status === "Invalid")
            ? 0
            : x.documents.some((d) => d.aiAnalysis.status === "Unchecked")
              ? 1
              : 2;
        cmp = score(a) - score(b);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [applicants, search, filterStatus, filterNationality, filterGender, sortBy, sortDir]);

  const stats = useMemo(() => ({
    total: applicants.length,
    complete: applicants.filter((a) => !a.documents.some((d) => d.aiAnalysis.status !== "Valid")).length,
    issues: applicants.filter((a) => a.documents.some((d) => d.aiAnalysis.status === "Invalid")).length,
    review: applicants.filter((a) => a.documents.some((d) => d.aiAnalysis.status === "Unchecked") && !a.documents.some((d) => d.aiAnalysis.status === "Invalid")).length,
  }), [applicants]);

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: typeof sortBy }) =>
    sortBy === col ? <span className="ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span> : <span className="ml-0.5 opacity-30">↕</span>;

  const activeFilters = [filterStatus !== "All", filterNationality !== "All", filterGender !== "All"].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs text-gray-400">
        Home &rsaquo; Admission &rsaquo; <span className="text-[#003DA5] font-medium">Helmut-Schmidt — All Applicants</span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">Applicant Stack</h1>
          <p className="text-sm text-gray-500 mt-0.5">Helmut-Schmidt-Programme · AI Document Validation · Winter Semester 2027/28</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          AI validation active
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Applicants", value: stats.total, color: "bg-[#003DA5]" },
          { label: "Complete", value: stats.complete, color: "bg-green-600" },
          { label: "Issues Found", value: stats.issues, color: "bg-red-600" },
          { label: "Needs Review", value: stats.review, color: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl px-5 py-4 shadow-sm`}>
            <div className="text-3xl font-bold text-white">{s.value}</div>
            <div className="text-xs mt-1 text-white opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, applicant no., email, nationality…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>

          {/* Status quick filter */}
          <div className="flex gap-1">
            {(["All", "Complete", "Issues", "Review"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  filterStatus === f
                    ? "bg-[#003DA5] text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#003DA5]/40 hover:text-[#003DA5]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* More filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
              showFilters || activeFilters > 0
                ? "bg-[#003DA5]/10 text-[#003DA5] border-[#003DA5]/30"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {activeFilters > 0 && (
              <span className="bg-[#003DA5] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{activeFilters}</span>
            )}
          </button>

          <div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
            {filtered.length} of {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Nationality</label>
              <select
                value={filterNationality}
                onChange={(e) => setFilterNationality(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5]"
              >
                {nationalities.map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5]"
              >
                <option value="All">All</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30"
              >
                <option value="name">Name</option>
                <option value="applicantNo">Applicant No.</option>
                <option value="status">Status</option>
              </select>
              <button onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")} className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-50">
                {sortDir === "asc" ? "A→Z" : "Z→A"}
              </button>
            </div>
            {(filterStatus !== "All" || filterNationality !== "All" || filterGender !== "All") && (
              <button
                onClick={() => { setFilterStatus("All"); setFilterNationality("All"); setFilterGender("All"); }}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                  <button onClick={() => toggleSort("name")} className="flex items-center hover:text-[#003DA5]">
                    Applicant <SortIcon col="name" />
                  </button>
                </th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600 whitespace-nowrap">Nationality</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600 whitespace-nowrap">
                  <button onClick={() => toggleSort("applicantNo")} className="flex items-center hover:text-[#003DA5]">
                    No. <SortIcon col="applicantNo" />
                  </button>
                </th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600 whitespace-nowrap">
                  <button onClick={() => toggleSort("status")} className="flex items-center mx-auto hover:text-[#003DA5]">
                    AI Status <SortIcon col="status" />
                  </button>
                </th>
                {STATUS_COLS.map((c) => (
                  <th key={c.key} className="text-center px-2 py-3 font-semibold text-gray-500 whitespace-nowrap">{c.short}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr
                  key={a.id}
                  className={`border-b border-gray-50 hover:bg-blue-50/40 cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
                  onClick={() => onSelect(a)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-gray-800">{a.lastName}, {a.firstName}</div>
                    <div className="text-gray-400 text-[10px]">{a.email}</div>
                  </td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{a.nationality}</td>
                  <td className="px-3 py-3 font-mono text-gray-500">{a.applicantNo}</td>
                  <td className="px-3 py-3 text-center"><OverallBadge applicant={a} /></td>
                  {STATUS_COLS.map((col) => {
                    const doc = a.documents.find((d) => d.type === col.key);
                    const status: DocStatus | "—" = doc ? doc.aiAnalysis.status : "—";
                    return (
                      <td key={col.key} className="px-2 py-3 text-center">
                        <StatusPill status={status} />
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right">
                    <button className="text-[#003DA5] text-xs font-medium hover:underline">View →</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={STATUS_COLS.length + 5} className="text-center py-12 text-gray-400">
                    No applicants match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
