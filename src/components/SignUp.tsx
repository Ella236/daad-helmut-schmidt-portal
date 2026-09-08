import { useState } from "react";
import { saveAccount } from "../auth/store";

type Step = "form" | "confirm";

interface Props {
  onSignUp: () => void;
  onGoLogin: () => void;
}

export default function SignUp({ onSignUp, onGoLogin }: Props) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", institution: "", role: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const pwStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = pwStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"][strength];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        saveAccount({
          name: form.name,
          email: form.email,
          password: form.password,
          institution: form.institution,
          role: form.role,
          createdAt: new Date().toISOString(),
        });
        setLoading(false);
        setStep("confirm");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Sign-up failed.");
        setLoading(false);
      }
    }, 1000);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5] transition-all";

  /* Email confirmation screen */
  if (step === "confirm") {
    const mailtoLink = `mailto:${form.email}?subject=DAAD%20Helmut-Schmidt-Programme%20%E2%80%94%20Account%20Confirmation&body=Your%20account%20has%20been%20created%20successfully.%20You%20can%20now%20sign%20in%20to%20the%20selection%20committee%20portal%20at%20any%20time%20using%20your%20registered%20email%20and%20password.%0A%0AEmail%3A%20${encodeURIComponent(form.email)}%0A%0A%E2%80%94%20DAAD%20Helmut-Schmidt-Programme`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] p-8">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-serif mb-2">Account created!</h2>
          <p className="text-gray-500 text-sm mb-1">A confirmation has been sent directly to</p>
          <p className="text-[#003DA5] font-semibold text-sm mb-6">{form.email}</p>

          <a
            href={mailtoLink}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#003DA5] text-[#003DA5] font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Open my email inbox
          </a>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left text-xs text-gray-600 mb-5 space-y-2">
            <div className="font-semibold text-[#003DA5] text-sm mb-1">What happens next?</div>
            <div className="flex items-start gap-2">
              <span className="text-[#003DA5] font-bold flex-shrink-0">1.</span>
              Check your inbox at <span className="font-semibold text-gray-800">{form.email}</span> for the confirmation message.
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#003DA5] font-bold flex-shrink-0">2.</span>
              The message confirms your account details and access instructions.
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#003DA5] font-bold flex-shrink-0">3.</span>
              Sign in with your registered email and the password you just created.
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700 mb-5">
            <strong>Remember:</strong> Your password is required every time you log in. Keep it safe.
          </div>

          <button
            onClick={onSignUp}
            className="w-full bg-[#003DA5] text-white font-semibold py-3 rounded-xl hover:bg-[#002a73] transition-colors text-sm"
          >
            Continue to Portal
          </button>
          <button onClick={onGoLogin} className="mt-3 text-xs text-gray-400 hover:text-gray-600">
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-white font-serif text-3xl font-semibold leading-tight mb-4">
            Join the Selection Committee
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Create your committee account to start reviewing Helmut-Schmidt-Programme applications with AI-powered document validation.
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-5 text-blue-200 text-xs leading-relaxed">
          <div className="text-white font-semibold text-sm mb-2">Access Policy</div>
          New accounts receive a confirmation email immediately. Sign in with your registered email and password — your credentials are permanent and required for every session.
        </div>
        <div className="text-blue-300 text-[10px]">ST42 Helmut-Schmidt-Programm · Stipendienausschreibung 04/2026</div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-full bg-[#003DA5] flex items-center justify-center">
              <span className="text-white font-bold text-xs">DAAD</span>
            </div>
            <span className="font-semibold text-gray-800">Helmut-Schmidt-Programme</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-8">Register for committee portal access</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 flex items-start gap-2">
              <span className="text-red-500 flex-shrink-0 mt-0.5">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Full name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.name} onChange={set("name")} placeholder="Dr. Anna Schmidt" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Institutional email <span className="text-red-500">*</span>
              </label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="a.schmidt@h-brs.de" className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Institution</label>
                <input type="text" value={form.institution} onChange={set("institution")} placeholder="H-BRS" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Role</label>
                <select value={form.role} onChange={set("role")} className={inputClass}>
                  <option value="">Select…</option>
                  <option>Committee Chair</option>
                  <option>Committee Member</option>
                  <option>Programme Coordinator</option>
                  <option>Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className={inputClass + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColor : "bg-gray-200"} transition-all`} />
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-500">{strengthLabel} password</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="Repeat password"
                className={inputClass + (form.confirm && form.confirm !== form.password ? " border-red-300 focus:border-red-400" : "")}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input type="checkbox" id="terms" className="mt-0.5 accent-[#003DA5]" required />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I agree to the data processing terms and confirm I am an authorised member of the selection committee.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003DA5] text-white font-semibold py-3 rounded-xl hover:bg-[#002a73] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button onClick={onGoLogin} className="text-[#003DA5] font-semibold hover:underline">Sign in</button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-[10px] text-gray-400">
            Hochschule Bonn-Rhein-Sieg · HISinOne · © DAAD 2026
          </div>
        </div>
      </div>
    </div>
  );
}
