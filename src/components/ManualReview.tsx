import { useState } from "react";
import { type Applicant, type Document, type DocStatus, type AIStep } from "../data/applicants";
import EmailModal from "./EmailModal";
import DocumentReviewModal from "./DocumentReviewModal";

/* ── Criteria reference ───────────────────────────────────────────── */
const CRITERIA = [
  { heading: "Formal — Complete Document Set", items: ["All documents submitted including ticked-off and hand-signed checklist", "DAAD application form with typed answers", "Information consistent across all documents (name, dates, employment)"] },
  { heading: "Academic — Degree & Grades", items: ["University degree certificate present", "Completed with above-average grades (upper third of cohort)", "Degree awarded no earlier than 1 January 2020 (≤6 years)", "If second master's: well-argued justification provided", "Certified translation if original is not in German or English"] },
  { heading: "Transcript", items: ["Full set of transcripts for all academic years", "Grading system explanation (if not part of transcript)", "Certified translation if not in German or English"] },
  { heading: "Letter of Motivation", items: ["Maximum 2 pages", "Date of issue explicitly stated", "Addresses academic, professional, and personal reasons for applying", "Explains HSP goal alignment", "Addresses practical experience relevant to chosen master's course"] },
  { heading: "CV", items: ["Europass format only", "Full CV in reverse chronological order", "Employment gaps of ≥3 months explained", "Date of issue manually added", "Hand-signed"] },
  { heading: "Practical Experience", items: ["Written confirmation from employer or organisation", "On official headed paper", "Original (not scanned) or code-certified digital signature", "Date of issue stated", "Official stamp present"] },
  { heading: "Written Reference", items: ["From current employer OR university lecturer (if student)", "On official headed paper", "Original (not scanned) or code-certified digital signature", "Date of issue stated", "Official stamp present"] },
  { heading: "English Language Proof", items: ["Recognised test: IELTS, TOEFL, Cambridge, PTE, etc.", "Score meets programme minimum", "Certificate within validity period (typically 2 years)", "Official test result certificate"] },
  { heading: "Eligibility", items: ["Applicant from a DAC-eligible country", "Not more than 15 months spent in a non-DAC country at time of application"] },
];

/* ── Step result icon ─────────────────────────────────────────────── */
function StepIcon({ result }: { result: AIStep["result"] }) {
  if (result === "pass") return <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 text-[11px]">✓</span>;
  if (result === "fail") return <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 text-[11px]">✗</span>;
  if (result === "warn") return <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 text-[11px]">!</span>;
  return <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 text-[10px]">—</span>;
}

/* ── Review card ──────────────────────────────────────────────────── */
function ReviewCard({
  doc,
  index,
  totalDocs,
  reviewDecision,
  reviewNote,
  reviewRemark,
  onChange,
  onOpenModal,
}: {
  doc: Document;
  index: number;
  totalDocs: number;
  reviewDecision: DocStatus | "Pending";
  reviewNote: string;
  reviewRemark: string;
  onChange: (decision: DocStatus | "Pending", note: string, remark: string) => void;
  onOpenModal: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ai = doc.aiAnalysis;

  const borderColor =
    reviewDecision === "Valid" ? "border-l-green-500"
    : reviewDecision === "Invalid" ? "border-l-red-500"
    : ai.status === "Valid" ? "border-l-green-400"
    : ai.status === "Invalid" ? "border-l-red-400"
    : "border-l-amber-400";

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${borderColor} shadow-sm overflow-hidden`}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">{index + 1}</div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpen(!open)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-800">{doc.type}</span>
            <span className="text-[10px] text-gray-400 font-mono truncate">{doc.filename}</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">{doc.confirmation}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* AI status */}
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-400">AI: <span className={`font-semibold ${ai.status === "Valid" ? "text-green-700" : ai.status === "Invalid" ? "text-red-700" : "text-amber-600"}`}>{ai.status}</span></div>
            <div className="text-[10px] text-gray-400">{ai.confidence}% conf.</div>
          </div>
          {/* Reviewer badge */}
          {reviewDecision !== "Pending" ? (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${reviewDecision === "Valid" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
              ✓ {reviewDecision}
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">Pending</span>
          )}
          {/* Edit / Review button */}
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 bg-[#003DA5] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#002a73] transition-colors"
            title="Open document viewer and edit status"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Review
          </button>
          {/* Expand toggle */}
          <button onClick={() => setOpen(!open)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
            <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-4 bg-gray-50/30">
          {/* AI pipeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#003DA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#003DA5]">AI Validation Pipeline</span>
              <span className="text-[10px] font-mono text-gray-400 ml-auto">{ai.confidence}% confidence</span>
            </div>
            <div className="space-y-2">
              {ai.steps.map((step, i) => (
                <div key={i} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg ${step.result === "fail" ? "bg-red-50" : step.result === "warn" ? "bg-amber-50" : step.result === "skip" ? "bg-gray-50" : "bg-green-50/60"}`}>
                  <StepIcon result={step.result} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-800">{step.label}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${step.result === "pass" ? "bg-green-200 text-green-800" : step.result === "fail" ? "bg-red-200 text-red-800" : step.result === "warn" ? "bg-amber-200 text-amber-800" : "bg-gray-200 text-gray-600"}`}>
                        {step.result === "skip" ? "N/A" : step.result.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{step.description}</div>
                    <div className="text-[10px] text-gray-700 font-medium mt-0.5">→ {step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI findings / issues */}
          {(ai.findings.length > 0 || ai.issues.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ai.findings.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-green-700 mb-2">Findings</div>
                  <ul className="space-y-1">{ai.findings.map((f, i) => <li key={i} className="text-[11px] text-gray-700 flex gap-1.5"><span className="text-green-500 flex-shrink-0">✓</span>{f}</li>)}</ul>
                </div>
              )}
              {ai.issues.length > 0 && (
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-red-700 mb-2">Issues</div>
                  <ul className="space-y-1">{ai.issues.map((iss, i) => <li key={i} className="text-[11px] text-gray-700 flex gap-1.5"><span className="text-red-500 flex-shrink-0">✗</span>{iss}</li>)}</ul>
                </div>
              )}
            </div>
          )}

          {/* Quick decision */}
          <div className="border-t border-gray-200 pt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Quick decision:</span>
            {(["Valid", "Invalid", "Pending"] as const).map((d) => (
              <button
                key={d}
                onClick={() => onChange(d, reviewNote, reviewRemark)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${reviewDecision === d ? (d === "Valid" ? "bg-green-600 text-white border-green-600" : d === "Invalid" ? "bg-red-600 text-white border-red-600" : "bg-gray-600 text-white border-gray-600") : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
              >
                {d === "Pending" ? "Leave for later" : d}
              </button>
            ))}
            <button
              onClick={() => onChange(ai.status === "Unchecked" ? "Pending" : ai.status, reviewNote, reviewRemark)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#003DA5]/30 text-[#003DA5] bg-blue-50 hover:bg-blue-100 transition-all"
            >
              Accept AI
            </button>
            <button
              onClick={onOpenModal}
              className="ml-auto text-xs text-[#003DA5] font-medium hover:underline flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Open document viewer
            </button>
          </div>

          {reviewNote && (
            <div className="text-[10px] text-gray-500 bg-gray-100 rounded px-3 py-2">
              <strong>Internal note:</strong> {reviewNote}
            </div>
          )}
          {reviewRemark && (
            <div className="text-[10px] text-amber-700 bg-amber-50 rounded px-3 py-2">
              <strong>Applicant remark:</strong> {reviewRemark}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Criteria side panel ──────────────────────────────────────────── */
function CriteriaPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#003DA5] px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-blue-200 text-[10px] uppercase tracking-widest">ST42 · 04/2026</div>
            <div className="text-white font-semibold">DAAD Selection Criteria</div>
            <div className="text-blue-200 text-xs">Helmut-Schmidt-Programme</div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-lg">✕</button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {CRITERIA.map((section) => (
            <div key={section.heading}>
              <div className="font-semibold text-[#003DA5] text-sm mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#003DA5] rounded-full inline-block" />{section.heading}
              </div>
              <ul className="space-y-1.5 pl-3">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2"><span className="text-[#003DA5] flex-shrink-0 mt-0.5">•</span>{item}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
            <strong>Note:</strong> All master's courses have their own selection criteria that must be met <em>in addition to</em> the DAAD criteria above.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
interface DecisionEntry { decision: DocStatus | "Pending"; note: string; remark: string; }

interface Props {
  applicant: Applicant;
  senderName: string;
  senderEmail: string;
  onBack: () => void;
}

export default function ManualReview({ applicant, senderName, senderEmail, onBack }: Props) {
  const [decisions, setDecisions] = useState<Record<string, DecisionEntry>>(
    Object.fromEntries(applicant.documents.map((d) => [d.id, { decision: "Pending", note: "", remark: "" }]))
  );
  const [modalDocIdx, setModalDocIdx] = useState<number | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setDocDecision = (id: string, decision: DocStatus | "Pending", note: string, remark: string) => {
    setDecisions((prev) => ({ ...prev, [id]: { decision, note, remark } }));
  };

  const reviewed = Object.values(decisions).filter((d) => d.decision !== "Pending").length;
  const total = applicant.documents.length;
  const allReviewed = reviewed === total;
  const validCount = Object.values(decisions).filter((d) => d.decision === "Valid").length;
  const invalidCount = Object.values(decisions).filter((d) => d.decision === "Invalid").length;
  const pendingCount = Object.values(decisions).filter((d) => d.decision === "Pending").length;

  const acceptAll = () => {
    const updated: typeof decisions = {};
    applicant.documents.forEach((d) => {
      const aiStatus = d.aiAnalysis.status === "Unchecked" ? "Pending" : d.aiAnalysis.status;
      updated[d.id] = { decision: aiStatus, note: decisions[d.id]?.note ?? "", remark: decisions[d.id]?.remark ?? "" };
    });
    setDecisions(updated);
  };

  const activeDoc = modalDocIdx !== null ? applicant.documents[modalDocIdx] : null;
  const activeEntry = activeDoc ? decisions[activeDoc.id] : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[#003DA5] hover:underline font-medium">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Overview
        </button>
        <span className="text-gray-300">|</span>
        <div className="bg-[#fef3b4] text-xs px-3 py-1 rounded font-medium text-gray-700">
          {applicant.firstName} {applicant.lastName} · No. {applicant.applicantNo}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowCriteria(true)} className="flex items-center gap-1.5 text-xs border border-[#003DA5]/30 text-[#003DA5] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            DAAD Criteria
          </button>
          <button onClick={acceptAll} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            Accept all AI decisions
          </button>
        </div>
      </div>

      {/* Summary header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-[#003DA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#003DA5]">Manual Review</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">{applicant.firstName} {applicant.lastName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{applicant.programme} · {applicant.semester}</p>
            <p className="text-xs text-gray-400 mt-1">Reviewer: <span className="font-medium text-gray-600">{senderName}</span> · Click <strong>Review</strong> on any document to open the viewer</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "Reviewed", value: `${reviewed}/${total}`, bg: "bg-gray-50", border: "border-gray-100", text: "text-gray-800" },
              { label: "Valid", value: validCount, bg: "bg-green-50", border: "border-green-100", text: "text-green-700" },
              { label: "Invalid", value: invalidCount, bg: "bg-red-50", border: "border-red-100", text: "text-red-700" },
              { label: "Pending", value: pendingCount, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700" },
            ].map((s) => (
              <div key={s.label} className={`text-center px-4 py-2 ${s.bg} rounded-lg border ${s.border}`}>
                <div className={`text-xl font-bold ${s.text}`}>{s.value}</div>
                <div className="text-[10px] text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400">Review progress</span>
            <span className="text-[10px] font-semibold text-gray-600">{Math.round((reviewed / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#003DA5] rounded-full transition-all duration-500" style={{ width: `${(reviewed / total) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-3">
        {applicant.documents.map((doc, i) => (
          <ReviewCard
            key={doc.id}
            doc={doc}
            index={i}
            totalDocs={applicant.documents.length}
            reviewDecision={decisions[doc.id]?.decision ?? "Pending"}
            reviewNote={decisions[doc.id]?.note ?? ""}
            reviewRemark={decisions[doc.id]?.remark ?? ""}
            onChange={(decision, note, remark) => setDocDecision(doc.id, decision, note, remark)}
            onOpenModal={() => setModalDocIdx(i)}
          />
        ))}
      </div>

      {/* Final decision */}
      <div className={`rounded-xl border shadow-sm px-6 py-5 ${allReviewed ? (invalidCount > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200") : "bg-white border-gray-100"}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Review Summary</div>
            <div className={`text-lg font-bold font-serif ${invalidCount > 0 ? "text-red-700" : allReviewed ? "text-green-700" : "text-gray-700"}`}>
              {invalidCount > 0 ? "Documents Incomplete / Issues Found" : allReviewed ? "All Documents Valid" : "Review in Progress"}
            </div>
            {!allReviewed && <div className="text-xs text-amber-600 mt-1">{pendingCount} document{pendingCount !== 1 ? "s" : ""} still pending review.</div>}
            {allReviewed && <div className="text-xs text-gray-500 mt-1">Completed by {senderName} · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>}
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setEmailOpen(true)} className="flex items-center gap-2 bg-[#003DA5] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#002a73] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email Decision to Applicant
            </button>
            {submitted ? (
              <div className="flex items-center gap-2 text-green-700 text-sm font-semibold bg-green-100 px-4 py-2.5 rounded-xl border border-green-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Review submitted
              </div>
            ) : (
              <button
                onClick={() => { if (allReviewed) setSubmitted(true); }}
                disabled={!allReviewed}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              >
                {allReviewed ? "Submit Review" : `${pendingCount} remaining`}
              </button>
            )}
          </div>
        </div>

        {allReviewed && Object.entries(decisions).some(([, v]) => v.note || v.remark) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Reviewer Notes</div>
            <div className="space-y-1.5">
              {applicant.documents.map((doc) => {
                const d = decisions[doc.id];
                if (!d?.note && !d?.remark) return null;
                return (
                  <div key={doc.id} className="text-xs text-gray-600 space-y-0.5">
                    <span className="font-semibold text-gray-700">{doc.type}:</span>
                    {d.note && <div className="pl-3 text-gray-500">Internal: {d.note}</div>}
                    {d.remark && <div className="pl-3 text-amber-700">Applicant remark: {d.remark}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Document review modal */}
      {modalDocIdx !== null && activeDoc && activeEntry && (
        <DocumentReviewModal
          doc={activeDoc}
          docIndex={modalDocIdx}
          totalDocs={applicant.documents.length}
          decision={activeEntry.decision}
          note={activeEntry.note}
          remark={activeEntry.remark}
          onSave={(decision, note, remark, _confirmation) => {
            setDocDecision(activeDoc.id, decision, note, remark);
          }}
          onClose={() => setModalDocIdx(null)}
          onPrev={modalDocIdx > 0 ? () => setModalDocIdx(modalDocIdx - 1) : undefined}
          onNext={modalDocIdx < applicant.documents.length - 1 ? () => setModalDocIdx(modalDocIdx + 1) : undefined}
        />
      )}

      {showCriteria && <CriteriaPanel onClose={() => setShowCriteria(false)} />}
      {emailOpen && (
        <EmailModal
          applicant={applicant}
          senderName={senderName}
          senderEmail={senderEmail}
          reviewDecisions={decisions}
          onClose={() => setEmailOpen(false)}
        />
      )}
    </div>
  );
}
