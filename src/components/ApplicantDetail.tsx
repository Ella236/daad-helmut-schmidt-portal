import { useState } from "react";
import { type Applicant, type Document, type DocStatus } from "../data/applicants";
import EmailModal from "./EmailModal";
import ManualReview from "./ManualReview";

/* ── Simulated document content renderer ─────────────────────────── */
function DocPageContent({ doc, page }: { doc: Document; page: number }) {
  if (doc.type === "Application Form") {
    if (page === 1)
      return (
        <div className="p-8 font-sans text-sm text-gray-800 max-w-2xl mx-auto">
          <h2 className="text-center text-[#003DA5] font-bold text-base mb-1">
            Application for a DAAD scholarship in the
          </h2>
          <h2 className="text-center text-[#003DA5] font-bold text-base mb-6">Helmut-Schmidt-Programme</h2>
          <p className="text-center text-xs text-gray-600 mb-6">
            Information about you and the master&apos;s programmes you would like to apply for
          </p>
          <table className="w-full border-collapse text-xs mb-6">
            {[
              ["Surname(s) as stated in your passport", "HASAN"],
              ["First name(s) as stated in your passport", "MD MORSHED"],
              ["E-mail address", "morshedhasan.bu@gmail.com"],
              ["Date and place of birth", "22/12/1998, BARISHAL"],
              ["Country of permanent residence", "Bangladesh"],
              ["Nationality", "Bangladeshi"],
              ["Current professional occupation", "Project Associate"],
              ["What professional career do you envisage", "Policy and Programme Manager in the development sector"],
            ].map(([label, value]) => (
              <tr key={label} className="border border-gray-300">
                <td className="p-2 bg-gray-50 font-medium w-1/2">{label}</td>
                <td className="p-2">{value}</td>
              </tr>
            ))}
          </table>
        </div>
      );
    return (
      <div className="p-8 font-sans text-sm text-gray-800 max-w-2xl mx-auto">
        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
          Hereby, I agree that the DAAD and the chosen higher education institutions are allowed to process my above-stated personal data (e.g. name, date of birth etc.) in the context of the selection process for a scholarship in the Helmut-Schmidt-Programme.
        </p>
        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
          I confirm that all information provided in my application is correct, up-to-date and complete. I will inform the DAAD of any changes in my circumstances immediately.
        </p>
        <div className="mt-8 italic text-base font-serif text-gray-700">Morshed Hasan</div>
        <div className="border-t border-gray-400 mt-1 pt-1 text-xs text-gray-500">
          24/01/2026, Barishal &nbsp;&nbsp;&nbsp; Date and place
        </div>
      </div>
    );
  }

  if (doc.type === "Checklist")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#003DA5] flex items-center justify-center text-white font-bold text-xs">DAAD</div>
          <div>
            <div className="font-bold text-[#003DA5] text-sm">DAAD Application Checklist</div>
            <div className="text-gray-400">ST42 Helmut-Schmidt-Programm · 04/2026</div>
          </div>
        </div>
        {[
          ["DAAD Application Form", "mandatory"],
          ["Letter of Motivation (max. 2 pages)", "mandatory"],
          ["CV — Europass format", "mandatory"],
          ["University Certificates / Degree", "mandatory"],
          ["Transcript", "mandatory"],
          ["Proof of practical experience", "mandatory if to be considered"],
          ["Current written reference", "mandatory"],
          ["Proof of English language skills", "mandatory"],
          ["Passport copy", "mandatory"],
          ["Research Proposal (max. 3 pages)", "mandatory"],
        ].map(([item, req]) => (
          <div key={item} className="flex items-center gap-3 py-2 border-b border-gray-100">
            <div className="w-4 h-4 border-2 border-[#003DA5] flex items-center justify-center flex-shrink-0">
              <span className="text-[#003DA5] text-xs font-bold">✓</span>
            </div>
            <span className="flex-1">{item}</span>
            <span className="text-gray-400">{req}</span>
          </div>
        ))}
        <div className="mt-6 italic font-serif text-gray-700">Morshed Hasan</div>
        <div className="border-t border-gray-400 mt-1 pt-1 text-gray-500">24/01/2026, Barishal</div>
      </div>
    );

  if (doc.type === "Degree")
    return (
      <div className="p-8 text-center text-gray-800 max-w-2xl mx-auto">
        <div className="border-4 border-[#003DA5] p-8 text-center">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">University of Barishal</div>
          <div className="text-[#003DA5] font-serif text-xl font-bold mb-4">Certificate of Graduation</div>
          <p className="text-sm leading-relaxed mb-4">
            This is to certify that <strong>Md Morshed Hasan</strong> has successfully completed all requirements for the degree of
          </p>
          <div className="text-lg font-bold font-serif text-[#003DA5] mb-4">
            Bachelor of Business Administration (Honours)
          </div>
          <p className="text-xs text-gray-500 mb-6">Awarded in 2023 with CGPA 3.45 / 4.00</p>
          <div className="flex justify-between text-xs mt-8">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-1">Vice-Chancellor</div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-1">Registrar</div>
            </div>
          </div>
        </div>
      </div>
    );

  if (doc.type === "Transcript")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <div className="font-bold text-sm">University of Barishal — Official Transcript</div>
          <div className="text-gray-500">Student: Md Morshed Hasan · ID: UB-2019-BBA-0456</div>
        </div>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-[#003DA5] text-white">
              <th className="p-2 text-left">Course</th>
              <th className="p-2 text-center">Credits</th>
              <th className="p-2 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Principles of Economics", "3", "A"],
              ["Business Statistics", "3", "A-"],
              ["Organizational Behaviour", "3", "B+"],
              ["Financial Accounting", "3", "A"],
              ["Development Economics", "3", "A"],
              ["Public Policy & Governance", "3", "A-"],
              ["Research Methods", "3", "A"],
            ].map(([c, cr, g]) => (
              <tr key={c} className="border-b border-gray-100">
                <td className="p-2">{c}</td>
                <td className="p-2 text-center">{cr}</td>
                <td className="p-2 text-center font-semibold">{g}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-semibold">CGPA: 3.45 / 4.00</div>
      </div>
    );

  if (doc.type === "Passport")
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-[#1a3a6b] text-white p-6 rounded-lg">
          <div className="text-center text-xs mb-4 uppercase tracking-widest">People&apos;s Republic of Bangladesh</div>
          <div className="text-center text-lg font-bold mb-4">PASSPORT</div>
          <div className="bg-white/10 rounded p-4 text-xs grid grid-cols-2 gap-3">
            <div><div className="text-blue-300">Surname</div><div className="font-bold">HASAN</div></div>
            <div><div className="text-blue-300">Given Names</div><div className="font-bold">MD MORSHED</div></div>
            <div><div className="text-blue-300">Nationality</div><div>BANGLADESHI</div></div>
            <div><div className="text-blue-300">Date of Birth</div><div>22 DEC 1998</div></div>
            <div><div className="text-blue-300">Sex</div><div>M</div></div>
            <div><div className="text-blue-300">Place of Birth</div><div>BARISHAL</div></div>
            <div><div className="text-blue-300">Date of Issue</div><div>10 MAR 2022</div></div>
            <div><div className="text-blue-300">Date of Expiry</div><div>09 MAR 2032</div></div>
          </div>
          <div className="mt-4 font-mono text-[10px] text-center text-blue-200">
            P&lt;BGDHASAN&lt;&lt;MD&lt;MORSHED&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-8 flex items-center justify-center min-h-[300px] text-gray-400 text-sm">
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="font-medium text-gray-500">{doc.filename}</div>
        <div className="text-xs mt-1">{doc.type} · Page {page}</div>
      </div>
    </div>
  );
}

/* ── Document type icon color ─────────────────────────────────────── */
function docColor(type: string) {
  const map: Record<string, string> = {
    "Application Form": "bg-blue-100 text-blue-700",
    Checklist: "bg-indigo-100 text-indigo-700",
    Degree: "bg-purple-100 text-purple-700",
    Transcript: "bg-violet-100 text-violet-700",
    Language: "bg-teal-100 text-teal-700",
    Passport: "bg-green-100 text-green-700",
    CV: "bg-cyan-100 text-cyan-700",
    "Proof of Work": "bg-orange-100 text-orange-700",
    Reference: "bg-pink-100 text-pink-700",
    Motivation: "bg-rose-100 text-rose-700",
    "Research Proposal": "bg-amber-100 text-amber-700",
  };
  return map[type] ?? "bg-gray-100 text-gray-600";
}

/* ── Status badge ─────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: DocStatus }) {
  const cls = {
    Valid: "bg-green-100 text-green-800 border-green-200",
    Invalid: "bg-red-100 text-red-700 border-red-200",
    Unchecked: "bg-amber-100 text-amber-700 border-amber-200",
  }[status];
  const dot = { Valid: "bg-green-500", Invalid: "bg-red-500", Unchecked: "bg-amber-400" }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${dot}`} />
      {status}
    </span>
  );
}

/* ── Document list item (left panel) ─────────────────────────────── */
function DocListItem({
  doc,
  active,
  onClick,
}: {
  doc: Document;
  active: boolean;
  onClick: () => void;
}) {
  const [manualStatus, setManualStatus] = useState<DocStatus>(doc.status);
  const [editOpen, setEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<DocStatus>(doc.status);
  const borderColor =
    doc.aiAnalysis.status === "Valid"
      ? "border-l-green-500"
      : doc.aiAnalysis.status === "Invalid"
        ? "border-l-red-500"
        : "border-l-amber-400";

  return (
    <>
      <div
        onClick={onClick}
        className={`border-l-4 ${borderColor} px-4 py-3.5 cursor-pointer transition-all ${
          active ? "bg-blue-50 border-r-2 border-r-[#003DA5]" : "hover:bg-gray-50"
        } border-b border-gray-100`}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${docColor(doc.type)} flex-shrink-0`}>
              {doc.type.split(" ")[0]}
            </span>
            <span className="text-[11px] font-semibold text-gray-800 truncate">{doc.type}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <StatusBadge status={manualStatus !== doc.aiAnalysis.status ? manualStatus : doc.aiAnalysis.status} />
            <button
              onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}
              className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-[#003DA5] transition-colors"
              title="Edit"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filename */}
        <div className="text-[11px] text-[#003DA5] font-medium truncate mb-1">📎 {doc.filename}</div>

        {/* Confirmation */}
        <div className="text-[10px] text-gray-500 leading-relaxed mb-1.5">{doc.confirmation}</div>

        {/* Extra metadata for degree */}
        {doc.type === "Degree" && (
          <div className="text-[10px] text-gray-600 space-y-0.5">
            <div><span className="text-gray-400">University degrees acquired</span> Bachelor of Business Administration (Honours)</div>
            <div><span className="text-gray-400">Last degree completion</span> 2023</div>
          </div>
        )}

        {/* AI issues inline */}
        {doc.aiAnalysis.issues.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {doc.aiAnalysis.issues.slice(0, 2).map((iss, i) => (
              <div key={i} className="text-[10px] text-red-600 flex items-start gap-1">
                <span className="flex-shrink-0">⚠</span>{iss}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-gray-900 text-sm">Edit Status</div>
                <div className="text-xs text-gray-400">{doc.filename}</div>
              </div>
              <button onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="mb-4">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">Status</label>
              <div className="space-y-2">
                {(["Unchecked", "Invalid", "Valid"] as DocStatus[]).map((s) => (
                  <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="editstatus" value={s} checked={editStatus === s} onChange={() => setEditStatus(s)} className="accent-[#003DA5]" />
                    <span className={`text-sm font-medium ${s === "Valid" ? "text-green-700" : s === "Invalid" ? "text-red-700" : "text-amber-700"}`}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">Internal note</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 resize-none" rows={3} placeholder="Add a committee note…" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setManualStatus(editStatus); setEditOpen(false); }}
                className="flex-1 bg-[#003DA5] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#002a73] transition-colors"
              >
                Save
              </button>
              <button onClick={() => setEditOpen(false)} className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Thumbnail strip item ─────────────────────────────────────────── */
function Thumbnail({ doc, active, onClick }: { doc: Document; active: boolean; onClick: () => void }) {
  const color =
    doc.aiAnalysis.status === "Valid"
      ? "border-green-500"
      : doc.aiAnalysis.status === "Invalid"
        ? "border-red-500"
        : "border-amber-400";
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group`}
    >
      <div
        className={`w-16 h-20 border-2 ${active ? color : "border-gray-200"} rounded bg-white shadow-sm flex flex-col items-center justify-center transition-all group-hover:border-[#003DA5]/50 overflow-hidden`}
      >
        <div className={`w-8 h-10 rounded-sm ${active ? "bg-[#003DA5]/10" : "bg-gray-100"} flex items-center justify-center`}>
          <svg className={`w-4 h-4 ${active ? "text-[#003DA5]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        {/* Status dot */}
        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
          doc.aiAnalysis.status === "Valid" ? "bg-green-500" : doc.aiAnalysis.status === "Invalid" ? "bg-red-500" : "bg-amber-400"
        }`} />
      </div>
      <span className={`text-[9px] text-center leading-tight max-w-[64px] truncate ${active ? "text-[#003DA5] font-semibold" : "text-gray-500"}`}>
        {doc.filename.replace(".pdf", "").slice(0, 12)}
      </span>
    </button>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
interface Props {
  applicant: Applicant;
  onBack: () => void;
  senderName: string;
  senderEmail: string;
}

export default function ApplicantDetail({ applicant, onBack, senderName, senderEmail }: Props) {
  const [activeDocIdx, setActiveDocIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(90);
  const [emailOpen, setEmailOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);

  if (showReview) {
    return <ManualReview applicant={applicant} senderName={senderName} senderEmail={senderEmail} onBack={() => setShowReview(false)} />;
  }

  const activeDoc = applicant.documents[activeDocIdx];
  const totalPages = activeDoc.type === "Application Form" ? 2 : 1;

  const selectDoc = (idx: number) => { setActiveDocIdx(idx); setPage(1); };
  const prevDoc = () => { if (activeDocIdx > 0) selectDoc(activeDocIdx - 1); };
  const nextDoc = () => { if (activeDocIdx < applicant.documents.length - 1) selectDoc(activeDocIdx + 1); };

  const validCount = applicant.documents.filter((d) => d.aiAnalysis.status === "Valid").length;
  const invalidCount = applicant.documents.filter((d) => d.aiAnalysis.status === "Invalid").length;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[#003DA5] hover:underline font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-gray-300">|</span>
          <div className="bg-[#fef3b4] text-xs px-3 py-1 rounded font-medium text-gray-700">
            {applicant.firstName} {applicant.lastName} | Applicant no.: {applicant.applicantNo}
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-4">
          <span>{applicant.address}</span>
          <span className="text-[#003DA5]">✉ {applicant.email}</span>
          <span>📞 {applicant.phone}</span>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-2 text-xs">
        <button onClick={onBack} className="bg-white border border-gray-200 rounded px-3 py-1.5 text-gray-600 hover:bg-gray-50 font-medium">
          ← Back
        </button>
        <div className="flex items-center gap-1.5 ml-2 text-gray-500">
          <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded text-[10px]">{validCount} Valid</span>
          <span className="bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded text-[10px]">{invalidCount} Invalid</span>
          <span className="bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded text-[10px]">
            {applicant.documents.length - validCount - invalidCount} Unchecked
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-1.5 bg-white border border-[#003DA5] text-[#003DA5] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Manual Review
          </button>
          <button
            onClick={() => setEmailOpen(true)}
            className="flex items-center gap-1.5 bg-[#003DA5] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#002a73] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Applicant
          </button>
          <span className="text-[10px] text-gray-400">{applicant.semester}</span>
        </div>
      </div>

      {emailOpen && <EmailModal applicant={applicant} senderName={senderName} senderEmail={senderEmail} onClose={() => setEmailOpen(false)} />}

      {/* Main split layout */}
      <div className="flex gap-0 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden" style={{ minHeight: "calc(100vh - 260px)" }}>

        {/* LEFT: document list */}
        <div className="w-[300px] flex-shrink-0 border-r border-gray-200 overflow-y-auto flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Dokumente — {applicant.documents.length} files
            </div>
          </div>
          <div className="flex-1">
            {applicant.documents.map((doc, i) => (
              <DocListItem key={doc.id} doc={doc} active={i === activeDocIdx} onClick={() => selectDoc(i)} />
            ))}
          </div>
        </div>

        {/* RIGHT: document viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Thumbnail strip */}
          <div className="border-b border-gray-200 bg-gray-800 px-4 py-2">
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <button
                onClick={prevDoc}
                disabled={activeDocIdx === 0}
                className="w-7 h-7 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-30 flex items-center justify-center text-white flex-shrink-0 transition-colors"
              >
                ‹
              </button>
              {applicant.documents.map((doc, i) => (
                <Thumbnail key={doc.id} doc={doc} active={i === activeDocIdx} onClick={() => selectDoc(i)} />
              ))}
              <button
                onClick={nextDoc}
                disabled={activeDocIdx === applicant.documents.length - 1}
                className="w-7 h-7 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-30 flex items-center justify-center text-white flex-shrink-0 transition-colors"
              >
                ›
              </button>
            </div>
          </div>

          {/* Filename bar */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center gap-3">
            <span className="text-xs font-medium text-gray-600 flex-1 truncate">
              📄 {activeDoc.filename}
            </span>
            <StatusBadge status={activeDoc.aiAnalysis.status} />
            <button className="text-xs text-[#003DA5] hover:underline flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>

          {/* PDF toolbar */}
          <div className="border-b border-gray-200 bg-gray-700 px-4 py-1.5 flex items-center gap-3 text-white text-xs">
            <div className="flex items-center gap-1 text-gray-300 text-[11px]">
              <span className="opacity-60">rds</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="opacity-70 hover:opacity-100 disabled:opacity-30"
              >
                ‹
              </button>
              <span className="text-[11px] tabular-nums">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="opacity-70 hover:opacity-100 disabled:opacity-30"
              >
                ›
              </button>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="opacity-70 hover:opacity-100 px-1">−</button>
              <span className="text-[11px] tabular-nums w-10 text-center">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="opacity-70 hover:opacity-100 px-1">+</button>
            </div>
            <div className="ml-auto flex items-center gap-3 opacity-60">
              <button title="Rotate">↻</button>
              <button title="Print">🖨</button>
            </div>
          </div>

          {/* Document content */}
          <div className="flex-1 overflow-y-auto bg-gray-800">
            <div className="min-h-full flex items-start justify-center py-6 px-4">
              <div
                className="bg-white shadow-2xl w-full max-w-2xl transition-transform origin-top"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", minHeight: "700px" }}
              >
                <DocPageContent doc={activeDoc} page={page} />
              </div>
            </div>
          </div>

          {/* AI analysis footer */}
          <div className="border-t border-gray-200 bg-blue-50 px-5 py-3">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#003DA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-xs font-semibold text-[#003DA5]">AI Analysis</span>
                <span className="text-[10px] text-gray-400 font-mono">{activeDoc.aiAnalysis.confidence}% confidence</span>
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {activeDoc.aiAnalysis.findings.map((f, i) => (
                  <span key={i} className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">✓ {f}</span>
                ))}
                {activeDoc.aiAnalysis.issues.map((iss, i) => (
                  <span key={i} className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full">⚠ {iss}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
