import { useState } from "react";
import { login } from "../auth/store";

interface Props {
  onLogin: () => void;
  onGoSignUp: () => void;
  onForgotPassword: () => void;
}

export default function Login({ onLogin, onGoSignUp, onForgotPassword }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        login(email, password);
        onLogin();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Login failed.");
        setLoading(false);
      }
    }, 800);
  };

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
            Helmut-Schmidt-Programme
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            AI-powered document validation system for scholarship selection committees. Review, validate, and process applicant documents efficiently.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: "🤖", label: "AI Document Analysis", desc: "Automatic validation against DAAD criteria" },
            { icon: "📋", label: "Criteria Checking", desc: "Formal & content requirements verified" },
            { icon: "✉️", label: "Applicant Communication", desc: "Send review decisions directly by email" },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="text-white text-sm font-medium">{f.label}</div>
                <div className="text-blue-300 text-xs">{f.desc}</div>
              </div>
            </div>
          ))}
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

          <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to the selection committee portal</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 flex items-start gap-2">
              <span className="text-red-500 flex-shrink-0 mt-0.5">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="committee@h-brs.de"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30 focus:border-[#003DA5] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <button type="button" onClick={onForgotPassword} className="text-[11px] text-[#003DA5] hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003DA5] text-white font-semibold py-3 rounded-xl hover:bg-[#002a73] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <button onClick={onGoSignUp} className="text-[#003DA5] font-semibold hover:underline">Create account</button>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-[10px] text-gray-400">
            Hochschule Bonn-Rhein-Sieg · HISinOne · © DAAD 2026
          </div>
        </div>
      </div>
    </div>
  );
}
