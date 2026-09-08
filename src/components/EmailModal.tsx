import { useState } from "react";
import { type Applicant, type DocStatus } from "../data/applicants";

interface ReviewDecisions {
  [docId: string]: { decision: DocStatus | "Pending"; note: string; remark?: string };
}

interface Props {
  applicant: Applicant;
  senderName: string;
  senderEmail: string;
  reviewDecisions?: ReviewDecisions;
  onClose: () => void;
}

function buildDecisionBody(applicant: Applicant, decisions?: ReviewDecisions, senderName?: string): string {
  if (!decisions) return "";
  const invalidDocs = applicant.documents.filter((d) => decisions[d.id]?.decision === "Invalid");
  const validDocs = applicant.documents.filter((d) => decisions[d.id]?.decision === "Valid");
  const lines: string[] = [];
  lines.push(`Dear ${applicant.firstName} ${applicant.lastName},`);
  lines.push("");
  lines.push(`Thank you for submitting your application for the DAAD Helmut-Schmidt-Programme (Applicant No.: ${applicant.applicantNo}).`);
  lines.push("");
  if (invalidDocs.length > 0) {
    lines.push("Following our review of your submitted documents, the issues below require your attention:");
    lines.push("");
    invalidDocs.forEach((d) => {
      const note = decisions[d.id]?.note;
      lines.push(`  • ${d.type}`);
      if (d.aiAnalysis.issues.length > 0) {
        d.aiAnalysis.issues.forEach((iss) => lines.push(`    – ${iss}`));
      }
      if (decisions[d.id]?.remark) lines.push(`    Reviewer comment: ${decisions[d.id]?.remark}`);
      if (note) lines.push(`    Internal note: ${note}`);
    });
    lines.push("");
    lines.push("Please re-submit the corrected documents at your earliest convenience. Failure to provide the required documents may affect your application.");
  } else {
    lines.push("We are pleased to inform you that your application documents have been reviewed and are complete. All submitted documents meet the formal requirements of the programme.");
    lines.push("");
    lines.push("Your application will now proceed to the next stage of the selection process. We will be in touch with further information.");
  }
  lines.push("");
  lines.push("If you have any questions, please do not hesitate to contact us directly by replying to this email.");
  lines.push("");
  lines.push("Kind regards,");
  lines.push(senderName ?? "");
  return lines.join("\n");
}

const TEMPLATES = [
  { id: "decision", label: "Review Decision", subject: (a: Applicant) => `DAAD Helmut-Schmidt-Programme — Document Review: Applicant No. ${a.applicantNo}` },
  { id: "complete", label: "Documents Complete", subject: (a: Applicant) => `DAAD Helmut-Schmidt-Programme — Your Application Documents (No. ${a.applicantNo})` },
  { id: "missing", label: "Issues Found", subject: (a: Applicant) => `DAAD Helmut-Schmidt-Programme — Action Required: ${a.applicantNo}` },
  { id: "interview", label: "Interview Invitation", subject: (a: Applicant) => `DAAD Helmut-Schmidt-Programme — Interview Invitation: ${a.applicantNo}` },
  { id: "rejected", label: "Unsuccessful", subject: (a: Applicant) => `DAAD Helmut-Schmidt-Programme — Application Outcome: ${a.applicantNo}` },
];

function getTemplateBody(id: string, applicant: Applicant, senderName: string, reviewDecisions?: ReviewDecisions): string {
  const name = `${applicant.firstName} ${applicant.lastName}`;
  const no = applicant.applicantNo;
  switch (id) {
    case "decision":
      return buildDecisionBody(applicant, reviewDecisions, senderName);
    case "complete":
      return `Dear ${name},\n\nThank you for submitting your application for the DAAD Helmut-Schmidt-Programme (Applicant No.: ${no}).\n\nWe have reviewed your submitted documents and are pleased to inform you that your application file is complete. All required documents have been received and meet the formal requirements of the programme.\n\nYour application will now proceed to the next stage of the selection process. You will be contacted again with further information in due course.\n\nKind regards,\n${senderName}`;
    case "missing": {
      const issues = applicant.documents.filter((d) => d.aiAnalysis.status === "Invalid");
      const list = issues.map((d) => `  • ${d.type}: ${d.aiAnalysis.issues.join("; ")}`).join("\n");
      return `Dear ${name},\n\nThank you for applying to the DAAD Helmut-Schmidt-Programme (Applicant No.: ${no}).\n\nUpon review of your submitted documents, we have identified the following issues that require your attention:\n\n${list || "  • Please review your application documents."}\n\nPlease re-submit the corrected documents at your earliest convenience.\n\nIf you have any questions, please do not hesitate to contact us by replying to this email.\n\nKind regards,\n${senderName}`;
    }
    case "interview":
      return `Dear ${name},\n\nWe are pleased to inform you that your application for the DAAD Helmut-Schmidt-Programme (Applicant No.: ${no}) has been shortlisted following our initial document review.\n\nWe would like to invite you to a selection interview. Details regarding the date, time, and format will be communicated in a separate message.\n\nPlease confirm your availability by replying to this email.\n\nKind regards,\n${senderName}`;
    case "rejected":
      return `Dear ${name},\n\nThank you for your interest in the DAAD Helmut-Schmidt-Programme and for submitting your application (Applicant No.: ${no}).\n\nAfter careful consideration by the selection committee, we regret to inform you that your application has not been successful in this round of selection.\n\nWe encourage you to consider re-applying in future rounds and wish you every success in your academic and professional endeavours.\n\nKind regards,\n${senderName}`;
    default:
      return "";
  }
}

export default function EmailModal({ applicant, senderName, senderEmail, reviewDecisions, onClose }: Props) {
  const defaultTemplate = reviewDecisions ? "decision" : "complete";
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
  const [subject, setSubject] = useState(TEMPLATES.find((t) => t.id === defaultTemplate)!.subject(applicant));
  const [body, setBody] = useState(getTemplateBody(defaultTemplate, applicant, senderName, reviewDecisions));
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const applyTemplate = (id: string) => {
    const t = TEMPLATES.find((tt) => tt.id === id)!;
    setSelectedTemplate(id);
    setSubject(t.subject(applicant));
    setBody(getTemplateBody(id, applicant, senderName, reviewDecisions));
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#003DA5] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Email Applicant</div>
              <div className="text-xs text-gray-400">{applicant.firstName} {applicant.lastName} · {applicant.email}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">Email sent!</h3>
            <p className="text-gray-500 text-sm mb-1">Sent from <strong>{senderEmail}</strong> to</p>
            <p className="text-[#003DA5] font-semibold text-sm mb-6">{applicant.email}</p>
            <button onClick={onClose} className="bg-[#003DA5] text-white text-sm font-semibold px-8 py-2.5 rounded-xl hover:bg-[#002a73] transition-colors">Close</button>
          </div>
        ) : (
          <>
            {/* Templates */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Template</div>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.filter((t) => t.id !== "decision" || reviewDecisions).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${selectedTemplate === t.id ? "bg-[#003DA5] text-white border-[#003DA5]" : "bg-white text-gray-600 border-gray-200 hover:border-[#003DA5]/40"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* To */}
              <div className="flex items-center gap-3 text-sm border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold text-gray-400 w-10 flex-shrink-0">To</span>
                <span className="text-gray-700 text-sm">{applicant.firstName} {applicant.lastName} &lt;{applicant.email}&gt;</span>
              </div>
              {/* From — user's real email */}
              <div className="flex items-center gap-3 text-sm border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold text-gray-400 w-10 flex-shrink-0">From</span>
                <span className="text-gray-700 text-sm">{senderName} &lt;<span className="text-[#003DA5]">{senderEmail}</span>&gt;</span>
                <span className="text-[10px] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full ml-auto">Your account email</span>
              </div>
              {/* Subject */}
              <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold text-gray-400 w-10 flex-shrink-0 mt-2.5">Subject</span>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5]" />
              </div>
              {/* Body */}
              <div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 resize-none font-mono text-gray-700 leading-relaxed"
                />
                <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  Replies from the applicant will go directly to <span className="text-[#003DA5] font-medium">{senderEmail}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-[#003DA5] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#002a73] transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {sending ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending…</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>Send Email</>
                )}
              </button>
              <button onClick={onClose} className="text-sm text-gray-500 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <div className="ml-auto text-[10px] text-gray-400">Applicant No. {applicant.applicantNo}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
