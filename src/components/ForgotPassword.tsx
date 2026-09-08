import { useState } from "react";
import emailjs from "@emailjs/browser";
import { resetPassword, getAccounts } from "../auth/store";

type Step = "email" | "sent" | "reset" | "done";

interface Props {
  onBack: () => void;
}

/* EmailJS credentials — stored in localStorage so the user only enters them once */
const EJS_KEY = "daad_emailjs_config";
interface EJSConfig { serviceId: string; templateId: string; publicKey: string; }
function loadEJSConfig(): EJSConfig { try { return JSON.parse(localStorage.getItem(EJS_KEY) ?? "{}"); } catch { return { serviceId: "", templateId: "", publicKey: "" }; } }
function saveEJSConfig(c: EJSConfig) { localStorage.setItem(EJS_KEY, JSON.stringify(c)); }

function ConfigPanel({ onDone }: { onDone: () => void }) {
  const saved = loadEJSConfig();
  const [serviceId, setServiceId] = useState(saved.serviceId ?? "");
  const [templateId, setTemplateId] = useState(saved.templateId ?? "");
  const [publicKey, setPublicKey] = useState(saved.publicKey ?? "");
  const [saved2, setSaved2] = useState(false);

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5] font-mono transition-all";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveEJSConfig({ serviceId, templateId, publicKey });
    setSaved2(true);
    setTimeout(onDone, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-[#003DA5] px-6 py-4">
          <div className="text-blue-200 text-[10px] uppercase tracking-widest mb-0.5">One-time setup</div>
          <div className="text-white font-semibold text-lg">Connect EmailJS</div>
          <div className="text-blue-200 text-xs mt-0.5">Paste your credentials below — saved locally, never shared</div>
        </div>

        <div className="px-6 py-5">
          {/* Setup guide */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-gray-700 mb-5 space-y-2">
            <div className="font-semibold text-[#003DA5] text-sm">How to get your EmailJS credentials</div>
            <ol className="space-y-1.5 list-decimal pl-4">
              <li>Go to <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="text-[#003DA5] underline font-medium">emailjs.com</a> and create a free account.</li>
              <li>Under <strong>Email Services</strong>, add your email provider (Gmail, Outlook, etc.) and note the <strong>Service ID</strong>.</li>
              <li>Under <strong>Email Templates</strong>, create a template. Add these variables in the body: <code className="bg-gray-100 px-1 rounded">{"{{to_email}}"}</code>, <code className="bg-gray-100 px-1 rounded">{"{{to_name}}"}</code>, <code className="bg-gray-100 px-1 rounded">{"{{reset_time}}"}</code>. Note the <strong>Template ID</strong>.</li>
              <li>Under <strong>Account → API Keys</strong>, copy your <strong>Public Key</strong>.</li>
            </ol>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Service ID</label>
              <input value={serviceId} onChange={(e) => setServiceId(e.target.value)} placeholder="service_xxxxxxx" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Template ID</label>
              <input value={templateId} onChange={(e) => setTemplateId(e.target.value)} placeholder="template_xxxxxxx" className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Public Key</label>
              <input value={publicKey} onChange={(e) => setPublicKey(e.target.value)} placeholder="xxxxxxxxxxxxxxxxxxxx" className={inputClass} required />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className={`flex-1 font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 ${saved2 ? "bg-green-600 text-white" : "bg-[#003DA5] text-white hover:bg-[#002a73]"}`}
              >
                {saved2 ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Saved!</>
                ) : "Save & Continue"}
              </button>
              <button type="button" onClick={onDone} className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-400 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPassword({ onBack }: Props) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5] transition-all";

  const stepDone = (s: Step) => {
    const order: Step[] = ["email", "sent", "reset", "done"];
    return order.indexOf(s) < order.indexOf(step);
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account) { setError("No account found with this email address."); return; }

    const cfg = loadEJSConfig();
    if (!cfg.serviceId || !cfg.templateId || !cfg.publicKey) {
      setShowConfig(true);
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(
        cfg.serviceId,
        cfg.templateId,
        {
          to_email: email,
          to_name: account.name,
          reset_time: new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" }),
          message: "A password reset was requested for your DAAD Helmut-Schmidt-Programme selection committee account. Return to the portal and click \"I have read the email\" to set a new password.",
        },
        cfg.publicKey
      );
      setStep("sent");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("412") || msg.includes("Invalid") || msg.includes("service") || msg.includes("template")) {
        setError("EmailJS credentials appear incorrect. Please check your Service ID, Template ID, and Public Key.");
        setShowConfig(true);
      } else {
        setError("Failed to send email. Please check your EmailJS configuration.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPw.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        resetPassword(email, newPw);
        setLoading(false);
        setStep("done");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to reset password.");
        setLoading(false);
      }
    }, 800);
  };

  const cfg = loadEJSConfig();
  const configured = !!(cfg.serviceId && cfg.templateId && cfg.publicKey);

  return (
    <div className="min-h-screen flex bg-[#f4f6fa]">
      {/* Left branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#003DA5] px-12 py-12 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <span className="text-[#003DA5] font-bold text-sm">DAAD</span>
            </div>
            <div>
              <div className="text-blue-200 text-[10px] uppercase tracking-widest">German Academic Exchange Service</div>
              <div className="text-white font-semibold text-sm">Deutscher Akademischer Austauschdienst</div>
            </div>
          </div>
          <h2 className="text-white font-serif text-3xl font-semibold leading-tight mb-4">Account Recovery</h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            A reset message will be sent directly to your registered email inbox. Return here to set your new password.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { num: "1", label: "Enter your email address", s: "email" as Step },
            { num: "2", label: "Check your email inbox", s: "sent" as Step },
            { num: "3", label: "Set your new password", s: "reset" as Step },
          ].map((item) => (
            <div key={item.num} className={`flex items-center gap-3 transition-opacity ${stepDone(item.s) || step === item.s ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${stepDone(item.s) ? "bg-green-400 text-white" : step === item.s ? "bg-white text-[#003DA5]" : "bg-white/20 text-white"}`}>
                {stepDone(item.s) ? "✓" : item.num}
              </div>
              <span className="text-white text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="text-blue-300 text-[10px]">ST42 Helmut-Schmidt-Programm · Stipendienausschreibung 04/2026</div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Step 1 — email input */}
          {step === "email" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">Forgot your password?</h1>
              <p className="text-gray-500 text-sm mb-6">Enter your registered email and we will send a reset message directly to your inbox.</p>

              {/* EmailJS config status */}
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border mb-5 text-xs ${configured ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                <div className={`flex items-center gap-2 ${configured ? "text-green-700" : "text-amber-700"}`}>
                  <span>{configured ? "✓" : "⚠"}</span>
                  <span className="font-medium">{configured ? "EmailJS configured" : "EmailJS not configured yet"}</span>
                </div>
                <button onClick={() => setShowConfig(true)} className="text-[#003DA5] font-semibold hover:underline">
                  {configured ? "Edit" : "Set up"}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 flex items-start gap-2">
                  <span className="flex-shrink-0">✕</span>{error}
                </div>
              )}
              <form onSubmit={handleEmail} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="committee@h-brs.de" className={inputClass} required />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#003DA5] text-white font-semibold py-3 rounded-xl hover:bg-[#002a73] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending…</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Send Reset Email</>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2 — sent */}
          {step === "sent" && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[#003DA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif mb-2">Email sent!</h1>
              <p className="text-gray-500 text-sm mb-1">A reset message has been delivered to</p>
              <p className="text-[#003DA5] font-semibold text-sm mb-6">{email}</p>

              <a
                href={`mailto:${email}`}
                className="w-full flex items-center justify-center gap-2 border-2 border-[#003DA5] text-[#003DA5] font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Open my email inbox
              </a>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-gray-600 text-left mb-6">
                Read the message in your inbox, then come back and set your new password.
              </div>

              <button
                onClick={() => setStep("reset")}
                className="w-full bg-[#003DA5] text-white font-semibold py-3 rounded-xl hover:bg-[#002a73] transition-colors text-sm"
              >
                I have read the email — Set new password
              </button>
            </div>
          )}

          {/* Step 3 — new password */}
          {step === "reset" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">Set new password</h1>
              <p className="text-gray-500 text-sm mb-8">Choose a strong password for <span className="font-medium text-gray-700">{email}</span></p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 flex items-start gap-2">
                  <span className="flex-shrink-0">✕</span>{error}
                </div>
              )}
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">New password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" className={inputClass + " pr-12"} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Confirm new password</label>
                  <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repeat password" className={inputClass + (confirmPw && confirmPw !== newPw ? " border-red-300" : "")} />
                  {confirmPw && confirmPw !== newPw && <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#003DA5] text-white font-semibold py-3 rounded-xl hover:bg-[#002a73] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                  {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</> : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif mb-2">Password updated</h1>
              <p className="text-gray-500 text-sm mb-8">Your password has been reset. Sign in with your email and new password.</p>
              <button onClick={onBack} className="w-full bg-[#003DA5] text-white font-semibold py-3 rounded-xl hover:bg-[#002a73] transition-colors text-sm">
                Back to Sign In
              </button>
            </div>
          )}

          {step !== "done" && (
            <button onClick={onBack} className="mt-6 w-full text-center text-sm text-gray-400 hover:text-gray-600">
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>

      {showConfig && <ConfigPanel onDone={() => setShowConfig(false)} />}
    </div>
  );
}
